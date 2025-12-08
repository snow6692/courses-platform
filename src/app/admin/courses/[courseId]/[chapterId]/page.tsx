import { adminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import QuizStructure from "@/components/quiz/admin/QuizStructure";
import { notFound } from "next/navigation";
import React from "react";

// Force dynamic rendering for always-fresh data
export const dynamic = "force-dynamic";

async function ChapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { chapterId, courseId } = await params;
  const quiz = await adminGetQuizOfCourse(courseId, chapterId);
  if (!courseId) notFound();
  if (!quiz) notFound();

  return (
    <QuizStructure quiz={quiz} courseId={courseId} chapterId={chapterId} />
  );
}

export default ChapterPage;
