import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import CourseSidebar from "@/components/course/CourseSidebar";
import React, { ReactNode } from "react";

interface IProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

async function CourseLayout({ children, params }: IProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      {/* Sidebar 30% */}
      <div className="border-border w-80 shrink-0 border-r">
        <CourseSidebar course={course} />
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default CourseLayout;
