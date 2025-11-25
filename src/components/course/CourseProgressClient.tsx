
"use client";

import { Progress } from "../ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";

type AcceptableCourseShape =
  | { chapters: { lessons: { id: string; lessonProgress?: any }[] }[] }
  | { course: AcceptableCourseShape }
  | { Course: AcceptableCourseShape };

interface CourseProgressClientProps {
  course: AcceptableCourseShape;
}

export function CourseProgressClient({ course }: CourseProgressClientProps) {
  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress(course); //

  if (totalLessons === 0) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">No lessons yet</span>
        </div>
        <Progress value={0} className="h-1.5" />
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {completedLessons}/{totalLessons} lessons
        </span>
      </div>
      <Progress value={progressPercentage} className="h-1.5" />
      <p className="text-muted-foreground text-xs">
        {progressPercentage}% completed
      </p>
    </div>
  );
}
