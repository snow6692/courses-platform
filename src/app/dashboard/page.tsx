import React, { Suspense } from "react";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import EmptyState from "@/components/shared/EmptyState";
import CourseProgressCard, {
  CourseProgressCardSkeleton,
} from "@/components/course/CourseProgressCard";
import { getServerLocale } from "@/lib/i18n";
import { BookOpen, GraduationCap, Trophy } from "lucide-react";

async function DashboardPage() {
  const { t, dir } = await getServerLocale();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8" dir={dir}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            <GraduationCap className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              {t("dashboard.my_courses") || "كورساتي"}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("dashboard.my_courses_description") ||
                "هنا تجد جميع الكورسات التي اشتركت فيها"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<DashboardSkeleton />}>
        <EnrolledCoursesContent />
      </Suspense>
    </div>
  );
}

async function EnrolledCoursesContent() {
  const { t } = await getServerLocale();
  const enrolledCourses = await getEnrolledCourses();

  if (enrolledCourses.length === 0) {
    return (
      <EmptyState
        title={t("dashboard.no_courses") || "لا توجد كورسات"}
        description={
          t("dashboard.no_courses_description") ||
          "لم تشترك في أي كورس بعد، استكشف الكورسات المتاحة وابدأ رحلة التعلم!"
        }
        buttonText={t("dashboard.browse_courses") || "تصفح الكورسات"}
        href="/courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-100">
            <BookOpen className="size-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{enrolledCourses.length}</p>
            <p className="text-muted-foreground text-sm">
              {t("dashboard.courses_count") || "كورس مسجل"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-xl bg-green-100">
            <Trophy className="size-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {
                enrolledCourses.filter((e) => {
                  // Calculate if course is completed
                  const totalLessons = e.Course.chapters.reduce(
                    (acc, ch) => acc + ch.lessons.length,
                    0,
                  );
                  const completedLessons = e.Course.chapters.reduce(
                    (acc, ch) =>
                      acc +
                      ch.lessons.filter((l) =>
                        l.lessonProgress.some((p) => p.completed),
                      ).length,
                    0,
                  );
                  return totalLessons > 0 && completedLessons === totalLessons;
                }).length
              }
            </p>
            <p className="text-muted-foreground text-sm">
              {t("dashboard.completed_courses") || "كورس مكتمل"}
            </p>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {enrolledCourses.map(({ Course: course }) => (
          <CourseProgressCard course={{ Course: course }} key={course.id} />
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="size-12 animate-pulse rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <CourseProgressCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
