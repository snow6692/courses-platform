import prisma from "@/lib/db";
import { requireAdmin } from "../../admin/require-admin";

export async function adminGetQuizOfCourse(
  courseId: string,
  chapterId?: string,
  lessonId?: string,
) {
  await requireAdmin();

  const quiz = await prisma.quiz.findFirst({
    where: {
      courseId,
      chapterId,
      lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimit: true,

      type: true,
      isActive: true,
      questions: {
        select: {
          id: true,
          imageKey: true,
          position: true,
          explanationVideoKey: true,
          explanationImageKey: true,
          explanation: true,
          text: true,

          answers: {
            select: {
              id: true,
              isCorrect: true,
              text: true,
            },
          },
        },
      },
    },
  });

  return quiz;
}

export type AdminGetQuizOfCourse = NonNullable<
  Awaited<ReturnType<typeof adminGetQuizOfCourse>>
>;
