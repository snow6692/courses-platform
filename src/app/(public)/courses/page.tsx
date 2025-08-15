import { getAllCourses } from "@/app/data/course/get-all-courses";
import PublicCourseCard, {
  PublicCourseCardSkeleton,
} from "@/components/course/PublicCourseCard";
import React, { Suspense } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
function PublicCoursesPage() {
  return (
    <ViewTransition enter={"slide-in"} exit={"slide-out"}>
      <div className="mt-5">
        <div className="mb-10 flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Explore Courses
          </h1>
          <p className="text-muted-foreground">
            Discover our wide range of courses designed to help you achieve your
            learning goals.{" "}
          </p>
        </div>
        <Suspense fallback={<LoadingSkeletonLayout />}>
          <RenderCourses />
        </Suspense>
      </div>
    </ViewTransition>
  );
}

export default PublicCoursesPage;

async function RenderCourses() {
  const courses = await getAllCourses();
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
