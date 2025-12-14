"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { requireUser } from "@/app/data/user/require-user";
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

          isFree: data.isFree,
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

export async function deleteLesson({
  lessonId,
  courseId,
  chapterId,
}: {
  lessonId: string;
  courseId: string;
  chapterId: string;
}): Promise<APIResponse> {
  await requireAdmin();

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLessons)
      return {
        status: "error",
        message: "Chapter not found",
      };

    const lessons = chapterWithLessons.lessons;

    const lessonsToDelete = lessons.find((lesson) => lesson.id === lessonId);
    if (!lessonsToDelete) {
      return {
        status: "error",
        message: "Lesson not found in the chapter",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates, // Execute the updates
      prisma.lesson.delete({
        where: { id: lessonId, chapterId: chapterId },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons deleted and positions reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete the lesson",
    };
  }
}

export async function updateLesson({
  values,
  lessonId,
  courseId,
}: {
  values: LessonSchemaType;
  lessonId: string;
  courseId: string;
}): Promise<APIResponse> {
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

    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: data.name,
        description: data.description,
        thumbnailKey: data.thumbnailKey,
        videoKey: data.videoKey,

        isFree: data.isFree,
      },
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to UPDATE the lesson",
    };
  }
}

export async function markLessonCompleted(
  lessonId: string,
  slug: string,
): Promise<APIResponse> {
  const user = await requireUser();
  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: user.id,
        lessonId,
        completed: true,
      },
    });
    revalidatePath(`/dashboard/${slug}`);
    return {
      message: "Progress updated",
      status: "success",
    };
  } catch (error) {
    return {
      message: "Failed to mark lesson as completed",
      status: "error",
    };
  }
}
