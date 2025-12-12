"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteQuestion(
  questionId: string,
): Promise<{ success: boolean; isFavorited: boolean }> {
  const user = await requireUser();

  const existing = await prisma.favoriteQuestion.findUnique({
    where: {
      userId_questionId: { userId: user.id, questionId },
    },
  });

  if (existing) {
    await prisma.favoriteQuestion.delete({
      where: { id: existing.id },
    });
    return { success: true, isFavorited: false };
  } else {
    await prisma.favoriteQuestion.create({
      data: { userId: user.id, questionId },
    });
    return { success: true, isFavorited: true };
  }
}

export async function submitQuiz(
  quizId: string,
  answers: Record<string, string | string[]>,
  timeTaken: number = 0,
) {
  const user = await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  let correctCount = 0;
  let totalQuestions = 0;
  const questionResults: {
    questionId: string;
    text: string;
    imageKey: string | null;
    explanation: string | null;
    explanationImageKey: string | null;
    explanationVideoKey: string | null;
    selectedAnswerIds: string[];
    correctAnswerIds: string[];
    isCorrect: boolean;
    isFavorited: boolean;
    answers: {
      id: string;
      text: string;
      imageKey: string | null;
      isCorrect: boolean;
    }[];
  }[] = [];

  // Get user's favorites for these questions
  const allQuestionIds = quiz.sections.flatMap((s) =>
    s.questions.map((q) => q.id),
  );
  const userFavorites = await prisma.favoriteQuestion.findMany({
    where: {
      userId: user.id,
      questionId: { in: allQuestionIds },
    },
    select: { questionId: true },
  });
  const favoritedQuestionIds = new Set(userFavorites.map((f) => f.questionId));

  for (const section of quiz.sections) {
    for (const question of section.questions) {
      totalQuestions++;
      const rawAnswer = answers[question.id];
      const selectedAnswerIds = Array.isArray(rawAnswer)
        ? rawAnswer
        : rawAnswer
          ? [rawAnswer]
          : [];

      const correctAnswers = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id);

      // Check if selected answers match correct answers exactly (ignoring order)
      const isCorrect =
        selectedAnswerIds.length === correctAnswers.length &&
        selectedAnswerIds.every((id) => correctAnswers.includes(id));

      if (isCorrect) {
        correctCount++;
      }

      questionResults.push({
        questionId: question.id,
        text: question.text,
        imageKey: question.imageKey,
        explanation: question.explanation,
        explanationImageKey: question.explanationImageKey,
        explanationVideoKey: question.explanationVideoKey,
        selectedAnswerIds,
        correctAnswerIds: correctAnswers,
        isCorrect,
        isFavorited: favoritedQuestionIds.has(question.id),
        answers: question.answers.map((a) => ({
          id: a.id,
          text: a.text,
          imageKey: a.imageKey,
          isCorrect: a.isCorrect,
        })),
      });
    }
  }

  const score = (correctCount / totalQuestions) * 100;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      answers: {
        create: Object.entries(answers).map(([questionId, rawAnswer]) => {
          const selectedAnswerIds = Array.isArray(rawAnswer)
            ? rawAnswer
            : rawAnswer
              ? [rawAnswer]
              : [];
          return {
            questionId,
            selectedAnswerIds,
            isCorrect:
              questionResults.find((q) => q.questionId === questionId)
                ?.isCorrect ?? false,
          };
        }),
      },
      finishedAt: new Date(),
    },
  });

  return {
    success: true,
    attemptId: attempt.id,
    score,
    totalQuestions,
    correctAnswers: correctCount,
    timeTaken,
    questions: questionResults,
  };
}

export async function getFavoriteQuestions() {
  const user = await requireUser();

  const favorites = await prisma.favoriteQuestion.findMany({
    where: { userId: user.id },
    include: {
      question: {
        include: {
          answers: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => f.question);
}
