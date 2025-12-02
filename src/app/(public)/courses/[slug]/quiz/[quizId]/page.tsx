import { getQuizForStudent } from "@/app/data/quiz/get-quiz";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
    quizId: string;
  }>;
}

export default async function QuizPage({ params }: PageProps) {
  const { quizId } = await params;
  const quiz = await getQuizForStudent(quizId);

  if (!quiz) return notFound();

  return <QuizPlayer quiz={quiz} />;
}
