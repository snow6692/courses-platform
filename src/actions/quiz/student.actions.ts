"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteQuestion(
  questionId: string,
): Promise<{ success: boolean; isFavorited: boolean }> {
  const user = await requireUser();

  const existing = await prisma.favoriteQuestion.findUnique({
    where: {
      userId_questionId: { userId: user.id, questionId },
    },
  });

  if (existing) {
    await prisma.favoriteQuestion.delete({
      where: { id: existing.id },
    });
    revalidatePath("/dashboard/favorites");
    return { success: true, isFavorited: false };
  } else {
    await prisma.favoriteQuestion.create({
      data: { userId: user.id, questionId },
    });
    revalidatePath("/dashboard/favorites");
    return { success: true, isFavorited: true };
  }
}
