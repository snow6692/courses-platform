import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import CourseSidebar from "@/components/course/CourseSidebar";
import { MobileSidebar } from "@/components/course/MobileSidebar";
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
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="border-border hidden w-80 shrink-0 border-r lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <CourseSidebar course={course} />
        </div>
      </div>

      {/* Mobile Sidebar - Floating button + Sheet */}
      <MobileSidebar course={course} />

      {/* Main content - Full width on mobile */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default CourseLayout;
