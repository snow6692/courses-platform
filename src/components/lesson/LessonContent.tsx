import { LessonContentType } from "@/app/data/course/get-lesson-content";

import RenderDescription from "../rich-text-editor/RenderDescription";
import VideoPlayer from "./VideoPlayer";
import CompleteLessonButton from "./CompleteLessonButton";

function LessonContent({ lesson }: { lesson: LessonContentType }) {
  return (
    <div className="bg-background flex h-full flex-col pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey ?? ""}
        videoKey={lesson.videoKey ?? ""}
      />
      <CompleteLessonButton id={lesson.id} slug={lesson.Chapter.Course.slug} lessonProgress={lesson.lessonProgress} />
      <div className="">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {lesson.title}
        </h1>
        {lesson.description && (
          <RenderDescription json={JSON.parse(lesson.description)} />
        )}
      </div>
    </div>
  );
}

export default LessonContent;
