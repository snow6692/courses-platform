"use client";

import React from "react";
import {
  ChevronDown,
  Play,
  FileQuestion,
  GraduationCap,
  FileText,
  Lock,
} from "lucide-react";
import { env } from "@/lib/config";
import { CourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { LessonItem } from "../lesson/LessonItem";
import { CourseProgressClient } from "./CourseProgressClient";
import Link from "next/link";
import { useQuizSafe } from "@/providers/QuizContext";
import { cn } from "@/lib/utils";

interface IProps {
  course: CourseSidebarData;
}

function CourseSidebar({ course }: IProps) {
  const { isQuizActive } = useQuizSafe();

  return (
    <div className={cn("flex h-full flex-col", isQuizActive && "opacity-60")}>
      <div className="border-border border-b pr-4 pb-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Play className="text-primary size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base leading-tight font-semibold">
              {course.title}
            </h1>
          </div>
        </div>

        <CourseProgressClient course={course} />

        {/* Course PDF Download Button */}
        {course.pdfKey && (
          <a
            href={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${course.pdfKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("mt-3 block", isQuizActive && "pointer-events-none")}
          >
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 transition-all hover:from-blue-100 hover:to-cyan-100">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-600">
                <FileText className="size-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">
                  تحميل ملف الكورس
                </p>
                <p className="text-xs text-blue-600">PDF Document</p>
              </div>
            </div>
          </a>
        )}

        {/* Course Quiz Button - Full width below progress */}
        {course.quizzes && course.quizzes.length > 0 && (
          <div
            className={cn("mt-3 block", isQuizActive && "pointer-events-none")}
          >
            {isQuizActive ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-gray-400">
                  <Lock className="size-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600">
                    اختبار الكورس النهائي
                  </p>
                  <p className="text-xs text-gray-500">
                    أكمل الاختبار الحالي أولاً
                  </p>
                </div>
              </div>
            ) : (
              <Link
                href={`/dashboard/${course.slug}/quiz/${course.quizzes[0].id}`}
              >
                <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 transition-all hover:from-purple-100 hover:to-indigo-100">
                  <div className="flex size-8 items-center justify-center rounded-full bg-purple-600">
                    <GraduationCap className="size-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900">
                      اختبار الكورس النهائي
                    </p>
                    <p className="text-xs text-purple-600">
                      {course.quizzes[0].title}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 py-4 pr-4">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="flex h-auto w-full items-center gap-2 p-3"
                disabled={isQuizActive}
              >
                <div className="shrink-0">
                  <ChevronDown className="text-primary size-4" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-foreground truncate text-sm font-semibold">
                    Chapter {chapter.position}: {chapter.title}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-muted-foreground text-xs">
                      {chapter.lessons.length} lessons
                    </span>
                    {chapter.quizzes && chapter.quizzes.length > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600">
                        Quiz
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {/* Lessons first */}
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  lesson={lesson}
                  slug={course.slug}
                  key={lesson.id}
                  isLocked={!course.isEnrolled && !lesson.isFree}
                  isPurchased={course.isEnrolled}
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id,
                    )?.completed || false
                  }
                  hasQuiz={lesson.quizzes && lesson.quizzes.length > 0}
                  disabled={isQuizActive}
                />
              ))}

              {/* Chapter Quiz Button - Below lessons */}
              {chapter.quizzes && chapter.quizzes.length > 0 && (
                <div
                  className={cn(
                    "block pt-2",
                    isQuizActive && "pointer-events-none",
                  )}
                >
                  {isQuizActive ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 p-2.5">
                      <div className="flex size-7 items-center justify-center rounded-full bg-gray-400">
                        <Lock className="size-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-600">
                          اختبار الفصل
                        </p>
                        <p className="text-[10px] text-gray-500">
                          أكمل الاختبار الحالي
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/dashboard/${course.slug}/quiz/${chapter.quizzes[0].id}`}
                    >
                      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-2.5 transition-all hover:from-red-100 hover:to-orange-100">
                        <div className="flex size-7 items-center justify-center rounded-full bg-red-600">
                          <FileQuestion className="size-3.5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-red-900">
                            اختبار الفصل
                          </p>
                          <p className="text-[10px] text-red-600">
                            {chapter.quizzes[0].title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
