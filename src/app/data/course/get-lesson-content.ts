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
      pdfKey: true,
      isFree: true,
      position: true,
      Chapter: {
        select: {
          courseId: true,
          Course: { select: { slug: true } },
        },
      },
      // لو في session نجيب الـ progress من الأول
      ...(session?.user && {
        lessonProgress: {
          where: { userId: session.user.id },
          select: { completed: true },
        },
      }),
    },
  });

  if (!lesson) notFound();

  // الدرس مجاني → الكل يشوفه (حتى لو مفيش session)
  if (lesson.isFree) {
    return {
      ...lesson,
      lessonProgress: lesson.lessonProgress ?? [],
    };
  }

  // الدرس مدفوع → لازم session + اشتراك
  if (!session?.user) notFound();

  // لو وصلنا هنا والدرس مش مجاني → نتحقق من الاشتراك
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.Chapter.courseId,
      },
    },
    select: { status: true },
  });

  if (!enrollment || enrollment.status !== "SUCCESSFUL") notFound();

  return {
    ...lesson,
    lessonProgress: lesson.lessonProgress ?? [],
  };
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
