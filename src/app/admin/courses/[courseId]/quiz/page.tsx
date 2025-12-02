import { adminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import QuizStructure from "@/components/quiz/admin/QuizStructure";
import { notFound } from "next/navigation";
import React from "react";

// Force dynamic rendering for always-fresh data
export const dynamic = "force-dynamic";

async function QuizCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const quiz = await adminGetQuizOfCourse(courseId);
  if (!courseId) notFound();

  if (!quiz) notFound();

  return <QuizStructure quiz={quiz} courseId={courseId} />;
}

export default QuizCoursePage;
