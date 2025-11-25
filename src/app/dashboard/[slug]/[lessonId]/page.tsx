import { getLessonContent } from "@/app/data/course/get-lesson-content";
import LessonContent from "@/components/lesson/LessonContent";
import LessonSkeleton from "@/components/lesson/LessonSkeleton";
import { Suspense } from "react";

export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />;
    </Suspense>
  );
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const lesson = await getLessonContent(lessonId);
  return <LessonContent lesson={lesson} />;
}
