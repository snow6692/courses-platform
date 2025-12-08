// components/lesson/LessonContent.tsx
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import RenderDescription from "../rich-text-editor/RenderDescription";
import VideoPlayer from "./VideoPlayer";
import PdfViewer from "./PdfViewer";
import CompleteLessonButton from "./CompleteLessonButton";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { PublicLessonType } from "@/app/data/lesson/getFreelessons";

// Unified interface compatible with both types
interface LessonProps {
  id: string;
  title: string;
  description: string | null;
  videoKey: string | null;
  thumbnailKey: string | null;
  pdfKey: string | null;
  Chapter: {
    Course: {
      slug: string;
      title: string;
    };
  };
  lessonProgress?: { completed: boolean }[] | any[]; // Relaxed type to handle both Prisma result and manual array
  quizzes?: { id: string }[];
}

interface LessonContentProps {
  lesson: LessonProps | LessonContentType | PublicLessonType;
}

export default function LessonContent({ lesson }: LessonContentProps) {
  const hasVideo = !!lesson.videoKey;
  const hasPdf = !!lesson.pdfKey;

  const progress =
    lesson.lessonProgress && Array.isArray(lesson.lessonProgress)
      ? lesson.lessonProgress
      : [];
  const isCompleted = progress.length > 0 && progress[0]?.completed === true;

  return (
    <div className="bg-background flex h-full flex-col gap-8 pt-6 pr-6 pb-12 pl-6">
      {/* Video Player */}
      {hasVideo && (
        <VideoPlayer
          thumbnailKey={lesson.thumbnailKey ?? ""}
          videoKey={lesson.videoKey!}
        />
      )}

      {/* PDF Viewer */}
      {hasPdf && <PdfViewer pdfKey={lesson.pdfKey!} title={lesson.title} />}

      {/* No Media Fallback */}
      {!hasVideo && !hasPdf && (
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground flex items-center gap-3">
              <FileText className="size-8" />
              لا يوجد ملف وسائط
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              هذا الدرس يحتوي فقط على وصف نصي.
            </p>
          </CardContent>
        </Card>
      )}

      {/* For enrollemnt use=er */}
      {progress !== null && (
        <div className="flex flex-col gap-4">
          <CompleteLessonButton
            id={lesson.id}
            slug={lesson.Chapter.Course.slug}
            isCompleted={isCompleted}
          />
          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <Button asChild variant="secondary" className="w-full">
              <Link
                href={`/courses/${lesson.Chapter.Course.slug}/quiz/${lesson.quizzes[0].id}`}
              >
                Start Quiz
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Lesson Title & Description */}
      <div className="space-y-6">
        <h1 className="text-foreground text-3xl font-bold tracking-tight lg:text-4xl">
          {lesson.title}
        </h1>

        {lesson.description ? (
          <RenderDescription json={JSON.parse(lesson.description)} />
        ) : (
          <p className="text-muted-foreground italic">
            لا يوجد وصف لهذا الدرس.
          </p>
        )}
      </div>
    </div>
  );
}
