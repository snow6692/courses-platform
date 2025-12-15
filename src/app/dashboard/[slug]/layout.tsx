import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import CourseSidebar from "@/components/course/CourseSidebar";
import { MobileSidebar } from "@/components/course/MobileSidebar";
import { QuizProvider } from "@/providers/QuizContext";
import { getLocale } from "@/lib/i18n";
import React, { ReactNode } from "react";

interface IProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

async function CourseLayout({ children, params }: IProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <QuizProvider>
      <div className="flex flex-1">
        {!isRTL && (
          /* LTR - Sidebar on LEFT */
          <div className="border-border hidden w-80 shrink-0 border-r lg:block">
            <div className="sticky top-0 h-screen overflow-y-auto pt-4 pr-2 pl-4">
              <CourseSidebar course={course} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-hidden">{children}</div>

        {isRTL && (
          /* RTL - Sidebar on RIGHT */
          <div className="border-border hidden w-80 shrink-0 border-l lg:block">
            <div className="sticky top-0 h-screen overflow-y-auto pt-4 pr-4 pl-2">
              <CourseSidebar course={course} />
            </div>
          </div>
        )}

        {/* Mobile Sidebar - Floating button + Sheet */}
        <MobileSidebar course={course} />
      </div>
    </QuizProvider>
  );
}

export default CourseLayout;
