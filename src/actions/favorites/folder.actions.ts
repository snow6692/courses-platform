"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Create a new folder
export async function createFolder(
  name: string,
  description?: string,
  color?: string,
): Promise<{
  success: boolean;
  folder?: { id: string; name: string };
  error?: string;
}> {
  try {
    const user = await requireUser();

    // Check if folder with same name exists
    const existing = await prisma.favoriteFolder.findUnique({
      where: {
        userId_name: { userId: user.id, name },
      },
    });

    if (existing) {
      return { success: false, error: "Folder with this name already exists" };
    }

    const folder = await prisma.favoriteFolder.create({
      data: {
        name,
        description,
        color: color || "#6366f1",
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/favorites");
    return { success: true, folder: { id: folder.id, name: folder.name } };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { success: false, error: "Failed to create folder" };
  }
}

// Update folder
export async function updateFolder(
  folderId: string,
  data: { name?: string; description?: string; color?: string },
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireUser();

    // Verify ownership
    const folder = await prisma.favoriteFolder.findFirst({
      where: { id: folderId, userId: user.id },
    });

    if (!folder) {
      return { success: false, error: "Folder not found" };
    }

    // Check if new name conflicts
    if (data.name && data.name !== folder.name) {
      const existing = await prisma.favoriteFolder.findUnique({
        where: {
          userId_name: { userId: user.id, name: data.name },
        },
      });
      if (existing) {
        return {
          success: false,
          error: "Folder with this name already exists",
        };
      }
    }

    await prisma.favoriteFolder.update({
      where: { id: folderId },
      data,
    });

    revalidatePath("/dashboard/favorites");
    return { success: true };
  } catch (error) {
    console.error("Error updating folder:", error);
    return { success: false, error: "Failed to update folder" };
  }
}

// Delete folder (also deletes all favorite questions in it)
export async function deleteFolder(
  folderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireUser();

    // Verify ownership
    const folder = await prisma.favoriteFolder.findFirst({
      where: { id: folderId, userId: user.id },
    });

    if (!folder) {
      return { success: false, error: "Folder not found" };
    }

    await prisma.favoriteFolder.delete({
      where: { id: folderId },
    });

    revalidatePath("/dashboard/favorites");
    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return { success: false, error: "Failed to delete folder" };
  }
}

// Get all folders with question counts
export async function getFolders() {
  const user = await requireUser();

  const folders = await prisma.favoriteFolder.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { favoriteQuestions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return folders.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    color: f.color,
    questionsCount: f._count.favoriteQuestions,
    createdAt: f.createdAt,
  }));
}

// Get folder with its questions
export async function getFolderWithQuestions(folderId: string) {
  const user = await requireUser();

  const folder = await prisma.favoriteFolder.findFirst({
    where: { id: folderId, userId: user.id },
    include: {
      favoriteQuestions: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!folder) {
    return null;
  }

  return {
    id: folder.id,
    name: folder.name,
    description: folder.description,
    color: folder.color,
    questions: folder.favoriteQuestions.map((fq) => fq.question),
  };
}

// Move question to different folder
export async function moveQuestionToFolder(
  questionId: string,
  targetFolderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireUser();

    // Verify user owns this favorite
    const favorite = await prisma.favoriteQuestion.findFirst({
      where: { userId: user.id, questionId },
    });

    if (!favorite) {
      return { success: false, error: "Favorite not found" };
    }

    // Verify user owns target folder
    const targetFolder = await prisma.favoriteFolder.findFirst({
      where: { id: targetFolderId, userId: user.id },
    });

    if (!targetFolder) {
      return { success: false, error: "Target folder not found" };
    }

    await prisma.favoriteQuestion.update({
      where: { id: favorite.id },
      data: { folderId: targetFolderId },
    });

    revalidatePath("/dashboard/favorites");
    return { success: true };
  } catch (error) {
    console.error("Error moving question:", error);
    return { success: false, error: "Failed to move question" };
  }
}
