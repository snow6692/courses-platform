"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { createAnswerSchema, createAnswerType } from "@/validation/answer.zod";
import { revalidatePath } from "next/cache";

export async function createAnswer(values: createAnswerType, courseId: string) {
  await requireAdmin();
  const validated = createAnswerSchema.safeParse(values);
  if (!validated.success) return { status: "error", message: "Invalid answer" };

  try {
    await prisma.answer.create({ data: validated.data });
    revalidatePath(`/admin/course/${courseId}/quiz`);
    return { status: "success", message: "Answer added" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Failed to add answer" };
  }
}

export async function toggleAnswerCorrect(
  answerId: string,
  isCorrect: boolean,
  courseId: string,
): Promise<APIResponse> {
  await requireAdmin();
  try {
    await prisma.answer.update({
      where: { id: answerId },
      data: { isCorrect },
    });
    revalidatePath(`/admin/courses/${courseId}/quiz`);
    return {
      message: "Correct answer updated successfully",
      status: "success",
    };
  } catch (error) {
    return {
      message: "Failed to change the correct answer",
      status: "error",
    };
  }
}

export async function updateAnswer(
  values: createAnswerType & { id: string },
  courseId: string,
) {
  await requireAdmin();

  const { id, ...data } = values;

  try {
    await prisma.answer.update({
      where: { id },
      data,
    });

    revalidatePath(`/admin/course/${courseId}/quiz`);
    return { status: "success", message: "Answer updated successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to update answer" };
  }
}

export async function deleteAnswer(answerId: string, courseId: string) {
  await requireAdmin();

  try {
    await prisma.answer.delete({
      where: { id: answerId },
    });

    revalidatePath(`/admin/course/${courseId}/quiz`);
    return {
      status: "success" as const,
      message: "Answer deleted successfully",
    };
  } catch (error) {
    console.error("Delete answer error:", error);
    return { status: "error" as const, message: "Failed to delete answer" };
  }
}
