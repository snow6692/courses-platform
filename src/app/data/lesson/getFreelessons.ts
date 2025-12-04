// app/data/course/get-lesson-content.ts
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getPublicLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      description: true,
      videoKey: true,
      pdfKey: true,
      thumbnailKey: true,
      isFree: true,
      Chapter: {
        select: {
          courseId: true,
          Course: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  // لو الدرس مش مجاني → ممنوع يفتح في المسار العام
  if (!lesson.isFree) {
    notFound(); // أو redirect(`/courses/${lesson.Chapter.Course.slug}`)
  }

  // الدرس مجاني → الكل يشوفه (حتى بدون تسجيل)
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId: session.user.id, lessonId },
      },
      select: { completed: true },
    });
    return { ...lesson, lessonProgress: progress ? [progress] : [] };
  }

  return { ...lesson, lessonProgress: [] };
}

export type PublicLessonType = Awaited<ReturnType<typeof getPublicLesson>>;
