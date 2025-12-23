import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "../../../components/course/AdminCourseCard";
import EmptyState from "@/components/shared/EmptyState";
import { getServerLocale } from "@/lib/i18n";

async function CoursesPage() {
  const { t } = await getServerLocale();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("admin.courses_page.your_courses")}
        </h1>
        <Link
          href="/admin/courses/create"
          className={buttonVariants({ variant: "default" })}
        >
          {t("admin.courses_page.create_course")}
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

export default CoursesPage;

async function RenderCourses() {
  const { t } = await getServerLocale();
  const { data, totalCourses } = await adminGetCourses({
    page: 1,
    limit: 10,
  });

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          href={"/admin/courses/create"}
          title={t("admin.courses_page.no_courses")}
          buttonText={t("admin.courses_page.create_a_course")}
          description={t("admin.courses_page.no_courses_description")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {data.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
