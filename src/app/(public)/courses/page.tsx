import { getAllCourses } from "@/app/data/course/get-all-courses";
import PublicCourseCard, {
  PublicCourseCardSkeleton,
} from "@/components/course/PublicCourseCard";
import { CourseSearchInput } from "@/components/course/CourseSearchInput";
import React, { Suspense } from "react";
import { getServerLocale } from "@/lib/i18n";

async function PublicCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { t } = await getServerLocale();
  const { search } = await searchParams;

  return (
    <div className="my-5 px-16">
      <div className="mb-10 flex flex-col space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("courses.title")}
          </h1>
          <p className="text-muted-foreground">{t("courses.description")}</p>
        </div>

        {/* Search Input - Client Component */}
        <Suspense fallback={<div className="h-10 w-full max-w-md" />}>
          <CourseSearchInput />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses search={search} />
      </Suspense>
    </div>
  );
}

export default PublicCoursesPage;

async function RenderCourses({ search }: { search?: string }) {
  const courses = await getAllCourses(search);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <PublicCourseCard course={course} key={course.id} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
