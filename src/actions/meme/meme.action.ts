"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { createMemeSchema, CreateMemeSchema } from "@/validation/meme.zod";
import { revalidatePath } from "next/cache";

export async function createMeme(
  values: CreateMemeSchema,
): Promise<APIResponse> {
  await requireAdmin();

  const validated = createMemeSchema.safeParse(values);
  if (!validated.success) {
    return { status: "error", message: validated.error.errors[0].message };
  }

  const { fileKey, type, trigger } = validated.data;

  try {
    await prisma.meme.create({
      data: {
        fileKey,
        type,
        trigger,
      },
    });

    // Revalidate the memes page to show the new meme
    revalidatePath("/admin/memes");
    return { status: "success", message: "Meme created successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create meme" };
  }
}

export async function deleteMeme(id: string): Promise<APIResponse> {
  await requireAdmin();
  try {
    await prisma.meme.delete({ where: { id } });
    revalidatePath("/admin/memes");
    return { status: "success", message: "Meme deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete meme" };
  }
}

export async function addMemeToQuiz(
  memeId: string,
  quizId: string,
): Promise<APIResponse> {
  await requireAdmin();
  try {
    // Check if meme exists
    const meme = await prisma.meme.findUnique({ where: { id: memeId } });
    if (!meme) return { status: "error", message: "Meme not found" };

    // Check if already added to this quiz
    const existing = await prisma.quizMeme.findUnique({
      where: {
        quizId_memeId: {
          quizId,
          memeId,
        },
      },
    });

    if (existing) {
      return { status: "error", message: "Meme already added to this quiz" };
    }

    // Create the relation
    await prisma.quizMeme.create({
      data: {
        quizId,
        memeId,
      },
    });

    revalidatePath(`/admin/courses`);
    return { status: "success", message: "Meme added to quiz" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to add meme to quiz" };
  }
}

export async function removeMemeFromQuiz(
  memeId: string,
  quizId: string,
): Promise<APIResponse> {
  await requireAdmin();
  try {
    // Delete the QuizMeme relation (not the meme itself)
    await prisma.quizMeme.delete({
      where: {
        quizId_memeId: {
          quizId,
          memeId,
        },
      },
    });

    revalidatePath(`/admin/courses`);
    return { status: "success", message: "Meme removed from quiz" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to remove meme from quiz" };
  }
}
