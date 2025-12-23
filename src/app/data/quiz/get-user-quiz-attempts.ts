import prisma from "@/lib/db";
import { requireUser } from "../user/require-user";

const ITEMS_PER_PAGE = 10;

export async function getUserQuizAttempts(page: number = 1) {
  const user = await requireUser();

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [attempts, totalCount] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            type: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            chapter: {
              select: {
                id: true,
                title: true,
              },
            },
            lesson: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.quizAttempt.count({
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    attempts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export type UserQuizAttempts = Awaited<ReturnType<typeof getUserQuizAttempts>>;
export type QuizAttemptWithQuiz = UserQuizAttempts["attempts"][number];
