import React, { Suspense } from "react";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import EmptyState from "@/components/shared/EmptyState";
import CourseProgressCard, {
  CourseProgressCardSkeleton,
} from "@/components/course/CourseProgressCard";
import { getServerLocale } from "@/lib/i18n";
import { BookOpen, Clock, Trophy, FileCheck } from "lucide-react";
import { requireUser } from "../data/user/require-user";
import Link from "next/link";
import { getUserNotifications } from "../data/user/get-notifications";
import { NotificationsSection } from "@/components/dashboard/NotificationsSection";
import { getWeeklyProgress } from "../data/user/get-weekly-progress";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";

async function DashboardPage() {
  const { t, dir } = await getServerLocale();
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] || "متعلم";

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8" dir={dir}>
      {/* Welcome Header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-l from-red-500 to-red-600 p-6 text-white shadow-lg md:p-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t("dashboard.welcome") || "مرحبا بك"}، {firstName}!
        </h1>
        <p className="mt-2 text-red-100">
          {t("dashboard.welcome_subtitle") ||
            "استمر في رحلتك التعليمية وحقق أهدافك"}
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const { t, locale } = await getServerLocale();
  const [enrolledCourses, notifications, weeklyProgress] = await Promise.all([
    getEnrolledCourses(),
    getUserNotifications(),
    getWeeklyProgress(locale as "ar" | "en"),
  ]);

  // Calculate stats
  const totalCourses = enrolledCourses.length;
  const totalLessons = enrolledCourses.reduce(
    (acc, e) =>
      acc + e.Course.chapters.reduce((a, ch) => a + ch.lessons.length, 0),
    0,
  );
  const completedLessons = enrolledCourses.reduce(
    (acc, e) =>
      acc +
      e.Course.chapters.reduce(
        (a, ch) =>
          a +
          ch.lessons.filter((l) => l.lessonProgress.some((p) => p.completed))
            .length,
        0,
      ),
    0,
  );
  const completedCourses = enrolledCourses.filter((e) => {
    const total = e.Course.chapters.reduce(
      (acc, ch) => acc + ch.lessons.length,
      0,
    );
    const completed = e.Course.chapters.reduce(
      (acc, ch) =>
        acc +
        ch.lessons.filter((l) => l.lessonProgress.some((p) => p.completed))
          .length,
      0,
    );
    return total > 0 && completed === total;
  }).length;

  const averageProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate estimated watching hours (assuming 60 min per lesson)
  const watchingHours = Math.round((completedLessons * 60) / 60);

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={BookOpen}
          value={totalCourses}
          label={t("dashboard.enrolled_courses") || "المواد المسجلة"}
          color="red"
        />
        <StatsCard
          icon={Clock}
          value={watchingHours}
          label={t("dashboard.watching_hours") || "ساعات المشاهدة"}
          color="amber"
        />
        <StatsCard
          icon={FileCheck}
          value={completedLessons}
          label={t("dashboard.completed_lessons") || "الدروس المكتملة"}
          color="blue"
        />
        <StatsCard
          icon={Trophy}
          value={`${averageProgress}%`}
          label={t("dashboard.average_progress") || "متوسط التقدم"}
          color="green"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Progress */}
        <WeeklyProgressChart
          data={weeklyProgress}
          totalProgress={averageProgress}
        />

        {/* Notifications */}
        <NotificationsSection notifications={notifications} />
      </div>

      {/* My Courses Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {t("dashboard.my_courses") || "كورساتي"}
          </h2>
          <Link
            href="/courses"
            className="text-sm text-red-600 hover:underline"
          >
            {t("dashboard.browse_more") || "تصفح المزيد"}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map(({ Course: course }) => (
            <CourseProgressCard course={{ Course: course }} key={course.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: "red" | "amber" | "blue" | "green";
}) {
  const colors = {
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
      <div
        className={`flex size-12 items-center justify-center rounded-xl ${colors[color]}`}
      >
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl border bg-gray-100" />
        <div className="h-80 animate-pulse rounded-xl border bg-gray-100" />
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
