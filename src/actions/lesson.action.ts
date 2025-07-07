"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/validation/lesson.zod";
import { revalidatePath } from "next/cache";

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<APIResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId,
        },
        data: {
          position: lesson.position,
        },
      }),
    );
    // run all the above commands in a single one
    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder lessons.",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validatedData = lessonSchema.safeParse(values);
    if (!validatedData.success) {
      return {
        status: "error",
        message: validatedData.error.message,
      };
    }
    const data = validatedData.data;

    //tx is prisma instance
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: {
          chapterId: data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.lesson.create({
        data: {
          chapterId: data.chapterId,
          title: data.name,
          description: data.description,
          videoKey: data.videoKey,
          thumbnailKey: data.thumbnailKey,
          position: maxPosition ? maxPosition.position : 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${data.courseId}/edit`);
    return {
      status: "success",
      message: "Lesson Created Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create new Lesson",
    };
  }
}
