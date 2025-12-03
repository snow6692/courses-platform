import prisma from "@/lib/db";
import { requireAdmin } from "../../admin/require-admin";

export async function adminGetQuizOfCourse(
  courseId: string,
  chapterId?: string,
  lessonId?: string,
) {
  await requireAdmin();

  // findFirst with proper where clause (findUnique doesn't support null in composite keys)
  const quiz = await prisma.quiz.findFirst({
    where: {
      courseId,
      chapterId: chapterId ?? null,
      lessonId: lessonId ?? null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimit: true,
      type: true,
      isActive: true,
      sections: {
        select: {
          id: true,
          position: true,
          timeLimit: true,
          title: true,
          questions: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              imageKey: true,
              position: true,
              explanationVideoKey: true,
              explanationImageKey: true,
              explanation: true,
              sectionId: true,
              text: true,
              answers: {
                select: {
                  id: true,
                  isCorrect: true,
                  text: true,
                  imageKey: true,
                },
              },
            },
          },
        },
      },

      memes: {
        select: {
          id: true,
          meme: {
            select: {
              id: true,
              fileKey: true,
              type: true,
              trigger: true,
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
