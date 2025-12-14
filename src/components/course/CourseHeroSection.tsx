import { getServerLocale } from "@/lib/i18n";
import { IconClock, IconUsers } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import PdfViewer from "../lesson/PdfViewer";

interface CourseHeroSectionProps {
  course: {
    title: string;
    smallDescription: string;
    level: string;
    category: string;
    duration: number;
    fileKey: string;
    pdfKey: string | null;
    chapters: { lessons: unknown[] }[];
    user: { name: string | null } | null;
    _count: { enrollments: number };
  };
}

export async function CourseHeroSection({ course }: CourseHeroSectionProps) {
  const { t, dir } = await getServerLocale();
  const isRTL = dir === "rtl";

  return (
    <div
      className={`mb-4 flex flex-col space-y-6 ${isRTL ? "text-right" : "text-left"}`}
      dir={dir}
    >
      {/* Category Badge */}
      <Badge className="mb-2 flex w-fit items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm">
        <span className="bg-primary mx-2 size-3 animate-pulse rounded-full"></span>
        <p className="text-foreground text-sm font-medium">{course.category}</p>
      </Badge>

      {/* Course Title */}
      <div className="space-y-4">
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight lg:text-5xl">
          {course.title}
        </h1>

        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          {course.smallDescription}
        </p>
      </div>

      {/* Stats Row */}
      <div
        className={`text-muted-foreground flex flex-wrap items-center gap-6 text-sm ${isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
      >
        <div
          className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <IconUsers className="size-4" />
          <span>
            {course._count.enrollments} {t("course_detail.students")}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <IconClock className="size-4" />
          <span>
            {course.duration} {t("course_detail.hours")}
          </span>
        </div>
      </div>
      {course.pdfKey && (
        <div className="mt-6">
          <PdfViewer pdfKey={course.pdfKey} title="Course Details PDF" />
        </div>
      )}
    </div>
  );
}
