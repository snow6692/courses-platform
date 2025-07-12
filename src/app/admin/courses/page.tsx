import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AdminCourseCard from "../../../components/course/AdminCourseCard";

async function CoursesPage() {
  const { data, totalCourses } = await adminGetCourses({
    page: 1,
    limit: 10,
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your courses</h1>
        <Link
          href="/admin/courses/create"
          className={buttonVariants({ variant: "default" })}
        >
          Create course
        </Link>
      </div>

      <div className="mt-4">
        <h1>Here are all courses</h1>
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {data.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
