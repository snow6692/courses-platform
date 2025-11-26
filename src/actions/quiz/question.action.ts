"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import {
  createAnswerSchema,
  createQuestionSchema,
} from "@/validation/question.zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createQuestion(
  values: z.infer<typeof createQuestionSchema>,
  courseId: string,
) {
  await requireAdmin();
  const validated = createQuestionSchema.safeParse(values);
  if (!validated.success) return { status: "error", message: "Invalid data" };

  try {
    const { quizId, ...data } = validated.data;

    const maxPosition = await prisma.question.findFirst({
      where: { quizId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.question.create({
      data: {
        ...data,
        quizId,
        position: (maxPosition?.position || 0) + 1,
      },
    });

    revalidatePath(`/admin/courses/${courseId}edit/${quizId}`);
    return { status: "success", message: "Question created" };
  } catch (error) {
    return { status: "error", message: "Failed to create question" };
  }
}

export async function createAnswer(
  values: z.infer<typeof createAnswerSchema>,
) {
  await requireAdmin();
  const validated = createAnswerSchema.safeParse(values);
  if (!validated.success) return { status: "error", message: "Invalid answer" };

  try {
    await prisma.answer.create({ data: validated.data });
    return { status: "success", message: "Answer added" };
  } catch (error) {
    return { status: "error", message: "Failed to add answer" };
  }
}

export async function toggleAnswerCorrect(
  answerId: string,
  isCorrect: boolean,
) {
  await requireAdmin();
  await prisma.answer.update({
    where: { id: answerId },
    data: { isCorrect },
  });
  revalidatePath(`/admin/quizzes`);
}

export async function deleteQuestion(
  questionId: string,
  quizId: string,
  courseId: string,
) {
  await requireAdmin();
  await prisma.$transaction(async (tx) => {
    await tx.question.delete({ where: { id: questionId } });
    // Reorder remaining
    const remaining = await tx.question.findMany({
      where: { quizId },
      orderBy: { position: "asc" },
    });
    await Promise.all(
      remaining.map((q, i) =>
        tx.question.update({
          where: { id: q.id },
          data: { position: i + 1 },
        }),
      ),
    );
  });
  revalidatePath(`/admin/courses/${courseId}/edit/${quizId}`);
  return { status: "success" };
}

export async function reorderQuestions(
  quizId: string,
  questions: { id: string; position: number }[],
) {
  await requireAdmin();
  await prisma.$transaction(
    questions.map((q) =>
      prisma.question.update({
        where: { id: q.id },
        data: { position: q.position },
      }),
    ),
  );
  revalidatePath(`/admin/quizzes/${quizId}`);
  return { status: "success" };
}
