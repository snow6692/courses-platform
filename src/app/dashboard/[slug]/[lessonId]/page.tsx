import { getLessonContent } from "@/app/data/course/get-lesson-content";
import LessonContent from "@/components/lesson/LessonContent";
import LessonSkeleton from "@/components/lesson/LessonSkeleton";
import { getServerLocale } from "@/lib/i18n";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import EnrollmentButton from "@/components/course/EnrollmentButton";

export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;

  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader slug={slug} lessonId={lessonId} />
    </Suspense>
  );
}

async function LessonContentLoader({
  slug,
  lessonId,
}: {
  slug: string;
  lessonId: string;
}) {
  const lesson = await getLessonContent(lessonId);
  const { t } = await getServerLocale();

  // Can access (free lesson OR enrolled)
  if (lesson.canAccess) {
    return <LessonContent lesson={lesson} />;
  }

  // Cannot access - show enroll prompt
  return (
    <div className="bg-bg-hero flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <Card className="max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="bg-primary/10 text-primary mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
            <Lock className="size-8" />
          </div>

          <h1 className="mb-2 text-2xl font-bold">
            {t("lesson.enroll_to_access")}
          </h1>

          <p className="text-muted-foreground mb-4">{lesson.title}</p>

          <p className="text-muted-foreground mb-6">
            {t("lesson.enroll_message")}
          </p>

          <div className="mb-6 rounded-lg border-2 p-4">
            <p className="text-muted-foreground text-sm">
              {t("lesson.course_price")}
            </p>
            <p className="text-primary text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(lesson.Chapter.Course.price)}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <EnrollmentButton courseId={lesson.Chapter.Course.id} />
            <Button variant="outline" asChild>
              <Link href={`/courses/${lesson.Chapter.Course.slug}`}>
                {t("lesson.view_full_course")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
