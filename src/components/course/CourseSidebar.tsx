import React from "react";
import { ChevronDown, Play } from "lucide-react";
import { CourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { Progress } from "../ui/progress";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";

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

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">4/10 lessons</span>
          </div>
          <Progress value={55} className="h-1.5" />
          <p className="text-muted-foreground text-xs">55% completed</p>
        </div>
      </div>

      <div className="space-y-3 py-4 pr-4">
        {course.chapters.map((chapter) => (
          <Collapsible key={chapter.id}>
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="flex h-auto w-full items-center gap-2 p-3"
              >
                <div className="shrink-0">
                  <ChevronDown className="text-primary size-4" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                    <p className="font-semibold text-sm truncate text-foreground">

                    {chapter.position}: {chapter.title}
                    </p>
                </div>
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
