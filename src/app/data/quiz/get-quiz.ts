import prisma from "@/lib/db";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function getQuizForStudent(quizId: string) {
  const user = await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, isActive: true },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: {
          questions: {
            orderBy: { position: "asc" },
            include: {
              answers: {
                select: { id: true, text: true, imageKey: true },
                orderBy: { id: "asc" },
              },
              favoriteQuestions: {
                where: { userId: user.id },
              },
            },
          },
        },
      },
    },
  });

  if (!quiz) notFound();

  // Check enrollment if quiz is COURSE type
  if (quiz.type === "COURSE" && quiz.courseId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId: quiz.courseId },
      },
    });
    if (!enrollment || enrollment.status !== "SUCCESSFUL") notFound();
  }

  return quiz;
}

export type QuizForStudent = Awaited<ReturnType<typeof getQuizForStudent>>;