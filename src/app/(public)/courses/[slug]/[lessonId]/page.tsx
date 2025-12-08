// app/courses/lesson/[lessonId]/page.tsx
import { getPublicLesson } from "@/app/data/lesson/getFreelessons";
import LessonContent from "@/components/lesson/LessonContent";
import LessonSkeleton from "@/components/lesson/LessonSkeleton";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PublicLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = await getPublicLesson(lessonId);

  return (
    <div className="bg-background min-h-screen">
      {/* Header مع زرار العودة للكورس */}
      <div className="bg-card border-b">
        <div className="container flex items-center justify-between py-6">
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <p className="text-muted-foreground">
              درس مجاني من كورس:{" "}
              <Link
                href={`/courses/${lesson.Chapter.Course.slug}`}
                className="text-primary hover:underline"
              >
                {lesson.Chapter.Course.title}
              </Link>
            </p>
          </div>
          <Button asChild>
            <Link href={`/courses/${lesson.Chapter.Course.slug}`}>
              شاهد الكورس كاملاً
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<LessonSkeleton />}>
        <LessonContent lesson={lesson} />
      </Suspense>
    </div>
  );
}
