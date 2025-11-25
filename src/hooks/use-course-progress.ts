
import { useMemo } from "react";

interface CourseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

type AnyCourseShape =
  | { chapters?: any[] }
  | { course?: AnyCourseShape }
  | { Course?: AnyCourseShape };

export function useCourseProgress(input: AnyCourseShape): CourseProgressResult {
  let current: any = input;
  while (current && !Array.isArray(current.chapters)) {
    if (current.course) {
      current = current.course;
    } else if (current.Course) {
      current = current.Course;
    } else {
      current = null;
      break;
    }
  }

  const chapters = Array.isArray(current?.chapters) ? current.chapters : [];

  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    chapters.forEach((chapter: any) => {
      const lessons = Array.isArray(chapter.lessons) ? chapter.lessons : [];
      lessons.forEach((lesson: any) => {
        if (lesson && lesson.id) {
          totalLessons++;

          const progress = lesson.lessonProgress;
          const isCompleted =
            Array.isArray(progress) &&
            progress.some(
              (p: any) => p.lessonId === lesson.id && p.completed === true,
            );

          if (isCompleted) completedLessons++;
        }
      });
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  }, [chapters]);
}
