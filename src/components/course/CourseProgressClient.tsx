"use client";

import { Progress } from "../ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useLanguage } from "@/providers/LanguageContext";

type AcceptableCourseShape =
  | { chapters: { lessons: { id: string; lessonProgress?: any }[] }[] }
  | { course: AcceptableCourseShape }
  | { Course: AcceptableCourseShape };

interface CourseProgressClientProps {
  course: AcceptableCourseShape;
}

export function CourseProgressClient({ course }: CourseProgressClientProps) {
  const { t } = useLanguage();
  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress(course);

  if (totalLessons === 0) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t("common.progress")}</span>
          <span className="font-medium">{t("common.no_lessons_yet")}</span>
        </div>
        <Progress value={0} className="h-1.5" />
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{t("common.progress")}</span>
        <span className="font-medium">
          {completedLessons}/{totalLessons} {t("common.lessons")}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-1.5" />
      <p className="text-muted-foreground text-xs">
        {progressPercentage}% {t("common.completed")}
      </p>
    </div>
  );
}
