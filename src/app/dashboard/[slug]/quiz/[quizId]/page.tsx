import { notFound } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";
import { getQuizForStudent } from "@/app/data/quiz/get-quiz";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { QuizPlayerSkeleton } from "@/components/quiz/QuizSkeletons";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; quizId: string }>;
}) {
  const { slug, quizId } = await params;

  return (
    <Suspense fallback={<QuizPlayerSkeleton />}>
      <QuizLoader slug={slug} quizId={quizId} />
    </Suspense>
  );
}

async function QuizLoader({ slug, quizId }: { slug: string; quizId: string }) {
  const user = await requireUser();

  // Find the course by slug
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!course) {
    return notFound();
  }

  // Admin users have access to all quizzes
  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    // Check if user is enrolled (only for non-admin users)
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          courseId: course.id,
          userId: user.id,
        },
      },
      select: { status: true },
    });

    if (!enrollment || enrollment.status !== "SUCCESSFUL") {
      return notFound();
    }
  }

  // Get the quiz
  const quiz = await getQuizForStudent(quizId);

  if (!quiz) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <QuizPlayer quiz={quiz} />
    </div>
  );
}
