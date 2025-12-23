// app/data/course/get-lesson-content.ts
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getLessonContent(lessonId: string) {
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
      canAccess: true,
      isEnrolled: true, // Treat admin as enrolled
    };
  }

  // Free lessons → everyone can view (even without login)
  if (lesson.isFree) {
    // Get progress if user is logged in
    let lessonProgress: { completed: boolean }[] = [];
    if (session?.user) {
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId },
        },
        select: { completed: true },
      });
      lessonProgress = progress ? [progress] : [];
    }

    return {
      ...lesson,
      lessonProgress,
      canAccess: true,
      isEnrolled: false, // Doesn't matter for free lessons
    };
  }

  // Paid lesson → check enrollment
  if (!session?.user) {
    // Not logged in → can't access paid lesson
    return {
      ...lesson,
      lessonProgress: [],
      canAccess: false,
      isEnrolled: false,
    };
  }

  // Check enrollment status
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.Chapter.courseId,
      },
    },
    select: { status: true },
  });

  const isEnrolled = enrollment?.status === "SUCCESSFUL";

  if (!isEnrolled) {
    // Not enrolled → show buy prompt
    return {
      ...lesson,
      lessonProgress: [],
      canAccess: false,
      isEnrolled: false,
    };
  }

  // Enrolled → get progress and show content
  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
    select: { completed: true },
  });

  return {
    ...lesson,
    lessonProgress: progress ? [progress] : [],
    canAccess: true,
    isEnrolled: true,
  };
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
