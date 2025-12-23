"use server";

import prisma from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

const ATTEMPTS_PER_PAGE = 5;

export async function getQuizPreviousAttempts(
  quizId: string,
  skip: number = 0,
) {
  const user = await requireUser();

  const [attempts, totalCount] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: {
        quizId,
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
      skip: skip + 1, // Skip the current attempt (first one)
      take: ATTEMPTS_PER_PAGE,
      select: {
        id: true,
        score: true,
        correctAnswers: true,
        totalQuestions: true,
        createdAt: true,
        finishedAt: true,
      },
    }),
    prisma.quizAttempt.count({
      where: {
        quizId,
        userId: user.id,
      },
    }),
  ]);

  return {
    attempts,
    totalCount: totalCount - 1, // Exclude current attempt from count
    hasMore: skip + ATTEMPTS_PER_PAGE < totalCount - 1,
  };
}

export type QuizPreviousAttempt = Awaited<
  ReturnType<typeof getQuizPreviousAttempts>
>["attempts"][number];
