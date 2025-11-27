"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { quizSchema, QuizSchema } from "@/validation/quiz.zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveQuiz(
  values: QuizSchema,
  type: "LESSON" | "CHAPTER" | "COURSE",
): Promise<APIResponse> {
  await requireAdmin();

  const validated = quizSchema.safeParse(values);
  if (!validated.success) {
    return { status: "error", message: validated.error.errors[0].message };
  }

  const {
    quizId,
    courseId,
    chapterId,
    lessonId,
    title,
    description,
    timeLimit,
  } = validated.data;

  try {
    if (quizId) {
      // Update
      await prisma.quiz.update({
        where: { id: quizId },
        data: {
          title,
          description,
          timeLimit: timeLimit || 60,
        },
      });
    } else {
      // Create
      await prisma.quiz.create({
        data: {
          timeLimit: timeLimit || 60,
          course: courseId ? { connect: { id: courseId } } : undefined,
          chapter: chapterId ? { connect: { id: chapterId } } : undefined,
          lesson: lessonId ? { connect: { id: lessonId } } : undefined,
          title,
          description,
          type,
        },
      });
    }
  } catch (error) {
    return {
      status: "error",
      message: quizId ? "Failed to update quiz" : "Failed to create quiz",
    };
  }
  redirect(`/admin/courses/${courseId}/edit/quiz`);
}

export async function deleteQuiz(quizId: string, courseId: string) {
  await requireAdmin();
  try {
    await prisma.quiz.delete({ where: { id: quizId } });

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: "success", message: "Quiz deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete quiz" };
  }
}
