import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getLessonContent(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      pdfKey: true,
      isFree: true,
      Chapter: {
        select: {
          courseId: true,
          Course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) return notFound();

  // Check if user is authenticated (but don't require it yet)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If the lesson is free
  if (lesson.isFree) {
    // If user is authenticated, fetch with progress tracking
    if (session?.user) {
      const lessonWithProgress = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailKey: true,
          videoKey: true,
          position: true,
          pdfKey: true,
          isFree: true,
          lessonProgress: {
            where: {
              userId: session.user.id,
            },
            select: {
              completed: true,
              lessonId: true,
            },
          },
          Chapter: {
            select: {
              courseId: true,
              Course: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      });
      return lessonWithProgress || lesson;
    }

    // If user is not authenticated, return lesson without progress
    return {
      ...lesson,
      lessonProgress: [],
    };
  }

  // For paid lessons, user must be authenticated and enrolled
  if (!session?.user) {
    return notFound();
  }

  const lessonWithProgress = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      pdfKey: true,
      isFree: true,
      lessonProgress: {
        where: {
          userId: session.user.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      Chapter: {
        select: {
          courseId: true,
          Course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lessonWithProgress) return notFound();

  // Check enrollment for paid lessons
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lessonWithProgress.Chapter.courseId,
      },
    },
    select: { status: true },
  });

  if (!enrollment || enrollment.status !== "SUCCESSFUL") {
    return notFound();
  }

  return lessonWithProgress;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
