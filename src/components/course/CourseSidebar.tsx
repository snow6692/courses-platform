import React from "react";
import { ChevronDown, Play } from "lucide-react";
import { CourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { LessonItem } from "../lesson/LessonItem";
import { CourseProgressClient } from "./CourseProgressClient";

interface IProps {
  course: CourseSidebarData;
}

function CourseSidebar({ course }: IProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b pr-4 pb-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Play className="text-primary size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base leading-tight font-semibold">
              {" "}
              {course.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">
              {course.category}
            </p>
          </div>
        </div>

        <CourseProgressClient course={course} />
      </div>

      <div className="space-y-3 py-4 pr-4">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="flex h-auto w-full items-center gap-2 p-3"
              >
                <div className="shrink-0">
                  <ChevronDown className="text-primary size-4" />
                </div>
                <div className="min-w-0 flex-1 space-x-4 text-left">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {chapter.position}: {chapter.title}
                  </p>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-muted-foreground size-[8px] truncate pb-5 text-xs font-medium">
                      {chapter.lessons.length}{" "}
                    </p>
                    <p className="">lessons</p>
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 border-l-2 pl-6">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  lesson={lesson}
                  slug={course.slug}
                  key={lesson.id}
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id,
                    )?.completed || false
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
