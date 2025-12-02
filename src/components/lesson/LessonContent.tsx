// components/lesson/LessonContent.tsx
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import RenderDescription from "../rich-text-editor/RenderDescription";
import VideoPlayer from "./VideoPlayer";
import PdfViewer from "./PdfViewer";
import CompleteLessonButton from "./CompleteLessonButton";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function LessonContent({ lesson }: { lesson: LessonContentType }) {
  const hasVideo = !!lesson.videoKey;
  const hasPdf = !!lesson.pdfKey;
  console.log("hey " + lesson.thumbnailKey);
  console.log("hey " + lesson.pdfKey);

  return (
    <div className="bg-background flex h-full flex-col gap-8 pt-6 pr-6 pb-12 pl-6">
      {hasVideo && (
        <VideoPlayer
          thumbnailKey={lesson.thumbnailKey ?? ""}
          videoKey={lesson.videoKey ?? ""}
        />
      )}

      {hasPdf && <PdfViewer pdfKey={lesson.pdfKey!} title={lesson.title} />}

      {!hasVideo && !hasPdf && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground flex items-center gap-3">
              <FileText className="size-8" />
              No media content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This lesson contains only a text description.
            </p>
          </CardContent>
        </Card>
      )}

      <CompleteLessonButton
        id={lesson.id}
        slug={lesson.Chapter.Course.slug}
        lessonProgress={lesson.lessonProgress}
      />

      <div className="space-y-6">
        <h1 className="text-foreground text-3xl font-bold tracking-tight lg:text-4xl">
          {lesson.title}
        </h1>

        {lesson.description ? (
          <RenderDescription json={JSON.parse(lesson.description)} />
        ) : (
          <p className="text-muted-foreground italic">
            No description provided.
          </p>
        )}
      </div>
    </div>
  );
}

export default LessonContent;
