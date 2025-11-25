import React from "react";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import EmptyState from "@/components/shared/EmptyState";
import PublicCourseCard from "@/components/course/PublicCourseCard";
import CourseProgressCard from "@/components/course/CourseProgressCard";

async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses that you have access to{" "}
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You haven't purchased any courses yet"
          buttonText="Browse courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enrolledCourses.map(({ Course: course }) => (
            <CourseProgressCard course={{ Course: course }} key={course.id} />
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Available courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses You can purchase
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id,
            ),
        ).length === 0 ? (
          <EmptyState
            title="No courses Available "
            description="You have already purchased all the available courses"
            buttonText="Browse courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id,
                  ),
              )
              .map((course) => (
                <PublicCourseCard key={course.id} course={course} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
