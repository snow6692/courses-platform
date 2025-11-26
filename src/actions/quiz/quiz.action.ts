"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import {
  addQuestionSchema,
  AddQuestionSchema,
  createQuizSchema,
  CreateQuizSchema,
} from "@/validation/quiz.zod";

export async function createQuiz(
  values: CreateQuizSchema,
): Promise<APIResponse> {
  await requireAdmin();

  const validated = createQuizSchema.safeParse(values);
  if (!validated.success) {
    return { status: "error", message: validated.error.errors[0].message };
  }

  const { courseId, chapterId, lessonId, ...data } = validated.data;

  try {
    await prisma.quiz.create({
      data: {
        ...data,
        course: courseId ? { connect: { id: courseId } } : undefined,
        chapter: chapterId ? { connect: { id: chapterId } } : undefined,
        lesson: lessonId ? { connect: { id: lessonId } } : undefined,
      },
    });

    // revalidatePath("/admin/quizzes");
    return { status: "success", message: "Quiz created successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to create quiz" };
  }
}

export async function addQuestion(
  values: AddQuestionSchema,
): Promise<APIResponse> {
  await requireAdmin();

  const validated = addQuestionSchema.safeParse(values);
  if (!validated.success) {
    return { status: "error", message: validated.error.errors[0].message };
  }

  const { quizId, answers, ...questionData } = validated.data;

  try {
    const maxPosition = await prisma.question.findFirst({
      where: { quizId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.$transaction(async (tx) => {
      const question = await tx.question.create({
        data: {
          ...questionData,
          quizId,
          position: (maxPosition?.position || 0) + 1,
        },
      });

      await tx.answer.createMany({
        data: answers.map((a) => ({
          questionId: question.id,
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      });
    });

    // revalidatePathd(`/admin/quiz/${quizId}`);
    return { status: "success", message: "Question added successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to add question" };
  }
}
