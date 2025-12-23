// app/data/course/get-lesson-content.ts
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Get lesson for public route - handles both free and paid lessons
export async function getPublicLesson(lessonId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      isFree: true,
      position: true,
      Chapter: {
        select: {
          courseId: true,
          Course: {
            select: { id: true, slug: true, title: true, price: true },
          },
        },
      },
      quizzes: {
        select: { id: true },
      },
    },
  });

  if (!lesson) notFound();

  // Admin users have access to all courses
  const isAdmin = session?.user?.role === "admin";
  if (isAdmin) {
    const progress = session?.user
      ? await prisma.lessonProgress.findUnique({
          where: {
            userId_lessonId: { userId: session.user.id, lessonId },
          },
          select: { completed: true },
        })
      : null;

    return {
      ...lesson,
      lessonProgress: progress ? [progress] : [],
      isEnrolled: true,
      canAccess: true,
    };
  }

  // Check if user is enrolled in the course
  let isEnrolled = false;
  if (session?.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.Chapter.courseId,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  // If lesson is free → everyone can view it
  if (lesson.isFree) {
    // Get progress if user is logged in
    if (session?.user) {
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId },
        },
        select: { completed: true },
      });
      return {
        ...lesson,
        lessonProgress: progress ? [progress] : [],
        isEnrolled,
        canAccess: true,
      };
    }
    return { ...lesson, lessonProgress: [], isEnrolled, canAccess: true };
  }

  // Lesson is NOT free
  // Return lesson info but mark canAccess based on enrollment
  return {
    ...lesson,
    lessonProgress: [],
    isEnrolled,
    canAccess: isEnrolled,
  };
}

export type PublicLessonType = Awaited<ReturnType<typeof getPublicLesson>>;
