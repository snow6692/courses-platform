"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { createQuestionSchema } from "@/validation/question.zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createQuestion(
  values: z.infer<typeof createQuestionSchema>,
  courseId: string,
  chapterId?: string,
  lessonId?: string,
): Promise<APIResponse> {
  await requireAdmin();
  const validated = createQuestionSchema.safeParse(values);
  if (!validated.success) return { status: "error", message: "Invalid data" };

  try {
    const { sectionId, ...data } = validated.data;

    const maxPosition = await prisma.question.findFirst({
      where: { sectionId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const question = await prisma.question.create({
      data: {
        ...data,
        sectionId,
        position: (maxPosition?.position || 0) + 1,
      },
    });
    revalidatePath(`/admin/courses/${courseId}/quiz`);

    return { status: "success", message: "Question created successfully" };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create question, Please try again.",
    };
  }
}

export async function updateQuestion(
  values: z.infer<typeof createQuestionSchema>,
  questionId: string,
  courseId: string,
): Promise<APIResponse> {
  await requireAdmin();
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: values,
    });
    return { status: "success", message: "Question updated successfully" };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update question, Please try again.",
    };
  }
}

export async function deleteQuestion(
  questionId: string,
  quizId: string,
  courseId: string,
  sectionId: string,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    await prisma.$transaction(async (tx) => {
      const question = await tx.question.findUnique({
        where: { id: questionId },
      });
      if (!question) {
        return { status: "error", message: "Question not found" };
      }
      await tx.question.delete({ where: { id: questionId } });
      // Reorder remaining
      const remaining = await tx.question.findMany({
        where: { sectionId },
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
    return { status: "success", message: "Question deleted successfully" };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete question, Please try again.",
    };
  }
}

export async function reorderQuestions(
  sectionId: string,
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
  return { status: "success" };
}
