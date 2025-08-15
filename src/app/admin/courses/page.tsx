import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "../../../components/course/AdminCourseCard";
import EmptyState from "@/components/shared/EmptyState";
import { unstable_ViewTransition as ViewTransition } from "react";

function CoursesPage() {
  return (
    <ViewTransition enter={"slide-in"} exit={"slide-out"}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your courses</h1>
        <Link
          href="/admin/courses/create"
          className={buttonVariants({ variant: "default" })}
        >
          Create course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </ViewTransition>
  );
}

export default CoursesPage;

async function RenderCourses() {
  const { data, totalCourses } = await adminGetCourses({
    page: 1,
    limit: 10,
  });

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          href={"/admin/courses/create"}
          title="No courses found"
          buttonText="Create a course"
          description="Create a new course to get started"
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
