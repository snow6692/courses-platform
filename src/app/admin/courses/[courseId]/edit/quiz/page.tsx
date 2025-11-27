import { adminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import { QuizStructure } from "@/components/quiz/QuizStructure";
import { notFound } from "next/navigation";
import React from "react";
async function QuizCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const quiz = await adminGetQuizOfCourse(courseId);
  if (!courseId) notFound();

  return <QuizStructure quiz={quiz} courseId={courseId} />;
}

export default QuizCoursePage;
