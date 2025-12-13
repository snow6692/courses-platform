"use client";

import { CourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import CourseSidebar from "@/components/course/CourseSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, BookOpen } from "lucide-react";
import { useState } from "react";

interface MobileSidebarProps {
  course: CourseSidebarData;
}

export function MobileSidebar({ course }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed right-4 bottom-4 z-50 size-14 rounded-full bg-red-600 shadow-lg hover:bg-red-700 lg:hidden"
        >
          <Menu className="size-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] p-0 sm:w-[400px]">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-red-600" />
            محتوى الكورس
          </SheetTitle>
        </SheetHeader>
        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 h-[calc(100%-60px)] overflow-y-auto p-4">
          <CourseSidebar course={course} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
