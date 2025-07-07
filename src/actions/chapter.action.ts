"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { chapterSchema, ChapterSchemaType } from "@/validation/chapter.zod";
import { revalidatePath } from "next/cache";

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[],
): Promise<APIResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No Chapters provided for reordering",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId,
        },
        data: { position: chapter.position },
      }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder chapters.",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validatedData = chapterSchema.safeParse(values);
    if (!validatedData.success) {
      return {
        status: "error",
        message: validatedData.error.message,
      };
    }
    const data = validatedData.data;

    //tx is prisma instance
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: {
          courseId: data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.chapter.create({
        data: {
          courseId: data.courseId,
          title: data.name,
          position: maxPosition ? maxPosition.position : 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${data.courseId}/edit`);
    return {
      status: "success",
      message: "Chapter Created Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create new chapter",
    };
  }
}
