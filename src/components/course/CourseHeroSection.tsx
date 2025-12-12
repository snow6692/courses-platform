import { Badge } from "@/components/ui/badge";
import { getServerLocale } from "@/lib/i18n";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";

interface CourseHeroSectionProps {
  course: {
    title: string;
    smallDescription: string;
    level: string;
    category: string;
    duration: number;
    fileKey: string;
    chapters: { lessons: unknown[] }[];
    user: { name: string | null } | null;
    _count: { enrollments: number };
  };
}

export async function CourseHeroSection({ course }: CourseHeroSectionProps) {
  const { t } = await getServerLocale();

  return (
    <div className="flex flex-col items-end space-y-6 text-right">
      {/* Category Badge */}
      <div className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-1.5 shadow-sm">
        <span className="text-foreground text-sm font-medium">
          {course.category}
        </span>
        <span className="text-primary mx-2">•</span>
        <span className="text-foreground text-sm font-medium">
          {course.level}
        </span>
      </div>

      {/* Course Info */}
      <div className="space-y-4">
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight lg:text-5xl">
          {course.title}
        </h1>

        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          {course.smallDescription}
        </p>
      </div>

      {/* Stats */}
      <div className="text-muted-foreground flex flex-wrap items-center justify-end gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <span>
            {course._count.enrollments} {t("course_detail.students") || "طالب"}
          </span>
          <IconUsers className="size-4" />
        </div>

        <div className="flex items-center gap-1.5">
          <span>
            {course.duration} {t("course_detail.hours")}
          </span>
          <IconClock className="size-4" />
        </div>
      </div>

      {/* Instructor */}
      <div className="pt-8 text-right">
        <h3 className="mb-1 text-lg font-bold">
          {course.user?.name || "Unknown Instructor"}
        </h3>
        <p className="text-muted-foreground text-sm">Creator of the course</p>
      </div>
    </div>
  );
}
