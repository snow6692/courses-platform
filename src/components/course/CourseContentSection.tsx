import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FreeLessonBadge } from "@/components/lesson/FreeLessonBadge";
import { getServerLocale } from "@/lib/i18n";
import { IconChevronDown, IconPlayerPlay } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { DoorClosedLockedIcon, FolderClosedIcon } from "lucide-react";
import { PaidLessonBadge } from "../lesson/PaidLessonBadge";

interface CourseContentSectionProps {
  course: {
    slug: string;
    chapters: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        isFree: boolean;
      }[];
    }[];
  };
  isEnrolled: boolean;
}

export async function CourseContentSection({
  course,
  isEnrolled,
}: CourseContentSectionProps) {
  const { t } = await getServerLocale();

  const totalLessons = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0,
  );

  return (
    <div className="bg-background space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          {t("course_detail.course_content")}
        </h2>
        <div className="">
          {course.chapters.length} {t("course_detail.chapters")} |{" "}
          {totalLessons} {t("course_detail.lessons")}
        </div>
      </div>

      <div className="space-y-4">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <Card className="bg-card border-border gap-0 overflow-hidden border-2 p-0 transition-all duration-200 hover:shadow-md">
              <CollapsibleTrigger>
                <div className="">
                  <CardContent className="hover:bg-muted/50 p-6 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="bg-primary/20 text-primary flex size-10 items-center justify-center rounded-full font-semibold">
                          {index + 1}
                        </p>
                        <div>
                          <h3 className="text-left text-xl font-semibold">
                            {chapter.title}
                          </h3>
                          <p className="text-muted-foreground m-1 text-left text-sm">
                            {chapter.lessons.length}
                            {chapter.lessons.length <= 1
                              ? ` ${t("course_detail.lesson")}`
                              : ` ${t("course_detail.lessons")}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={"outline"} className="text-xs">
                          {chapter.lessons.length}
                          {chapter.lessons.length <= 1
                            ? ` ${t("course_detail.lesson")}`
                            : ` ${t("course_detail.lessons")}`}
                        </Badge>

                        <IconChevronDown className="text-muted-foreground size-5" />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="bg-muted/20 border-t">
                  <div className="space-y-3 p-6 pt-4">
                    {chapter.lessons.map((lesson, lessonIndex) => {
                      const lessonLink = `/dashboard/${course.slug}/${lesson.id}`;

                      return (
                        <Link
                          href={lessonLink}
                          className="hover:bg-accent group flex items-center gap-4 rounded-lg p-3 transition-colors"
                          key={lesson.id}
                        >
                          <div className="border-primary/20 flex size-8 items-center justify-center rounded-full border-2">
                            <IconPlayerPlay className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                          </div>

                          <div className="flex-1">
                            {/* Free lessons and closed lessons icons with title */}
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {lesson.title}
                              </p>
                              {lesson.isFree && !isEnrolled && (
                                <FreeLessonBadge />
                              )}
                              {!lesson.isFree && !isEnrolled && (
                                <PaidLessonBadge />
                              )}
                            </div>

                            <p className="text-muted-foreground mt-1 text-xs">
                              {t("course_detail.lesson")} {lessonIndex + 1}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
