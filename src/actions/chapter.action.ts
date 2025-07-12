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
  } catch {
    return {
      status: "error",
      message: "Failed to create new chapter",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  courseId: string;
  chapterId: string;
}): Promise<APIResponse> {
  await requireAdmin();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapters: {
          select: {
            position: true,
            id: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!courseWithChapters)
      return {
        status: "error",
        message: "Course not found",
      };

    const chapters = courseWithChapters.chapters;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId,
    );
    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found in the chapter",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapterId !== chapter.id,
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updates, // Execute the updates
      prisma.chapter.delete({
        where: { id: chapterId, courseId: courseId },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapter deleted and positions reordered successfully",
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: "error",
      message: "Failed to delete  chapter",
    };
  }
}
