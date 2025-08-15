import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetEnrollmentsStat } from "../data/admin/admin-get-enrollments-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import EmptyState from "@/components/shared/EmptyState";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "@/components/course/AdminCourseCard";
import { Suspense } from "react";

async function AdminPage() {
  const enrollmentsData = await adminGetEnrollmentsStat();
  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={enrollmentsData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={"/admin/courses"}
          >
            View all courses
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

export default AdminPage;

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();
  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="create new Course"
        description="You don't have any courses. create some to see them here."
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.map((course) => (
        <AdminCourseCard course={course} key={course.id} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
