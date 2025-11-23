import { getLessonContent } from "@/app/data/course/get-lesson-content";
import LessonContent from "@/components/lesson/LessonContent";

export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = await getLessonContent(lessonId);
  return <LessonContent lesson={lesson} />;
}
