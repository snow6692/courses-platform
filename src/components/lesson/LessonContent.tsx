import { LessonContentType } from "@/app/data/course/get-lesson-content";
import {  CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import RenderDescription from "../rich-text-editor/RenderDescription";
import VideoPlayer from "./VideoPlayer";

function LessonContent({ lesson }: { lesson: LessonContentType }) {
 
  return (
    <div className="bg-background flex h-full flex-col pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey ?? ""}
        videoKey={lesson.videoKey ?? ""}
      />

      <div className="border-b py-4">
        <Button variant={"outline"}>
          <CheckCircle className="mr-2 size-4 text-green-500" />
          Mark as complete
        </Button>
      </div>

      <div className="">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
        {lesson.description && (
          <RenderDescription json={JSON.parse(lesson.description)} />
        )}
      </div>
    </div>
  );
}

export default LessonContent;
