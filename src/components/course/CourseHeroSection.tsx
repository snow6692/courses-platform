import { Badge } from "@/components/ui/badge";
import { getServerLocale } from "@/lib/i18n";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import Image from "next/image";

interface CourseHeroSectionProps {
  course: {
    title: string;
    smallDescription: string;
    level: string;
    category: string;
    duration: number;
    fileKey: string;
    chapters: { lessons: unknown[] }[];
  };
}

export async function CourseHeroSection({ course }: CourseHeroSectionProps) {
  const { t } = await getServerLocale();
  const thumbnailImage = useConstructUrl(course.fileKey);

  return (
    <div className="space-y-6">
      {/* Course Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
        <Image
          src={thumbnailImage}
          alt="Course thumbnail"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      {/* Course Info */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>

        <p className="text-muted-foreground line-clamp-2 text-lg leading-relaxed">
          {course.smallDescription}
        </p>
      </div>

      {/* Course Badges */}
      <div className="flex flex-wrap gap-3">
        <Badge className="flex items-center gap-1 px-3 py-1">
          <IconChartBar className="size-4" />
          <span>{course.level}</span>
        </Badge>
        <Badge className="flex items-center gap-1 px-3 py-1">
          <IconCategory className="size-4" />
          <span>{course.category}</span>
        </Badge>
        <Badge className="flex items-center gap-1 px-3 py-1">
          <IconClock className="size-4" />
          <span>
            {course.duration} {t("course_detail.hours")}
          </span>
        </Badge>
        <Badge className="flex items-center gap-1 px-3 py-1">
          <IconBook className="size-4" />
          <span>
            {course.chapters.reduce(
              (total, ch) => total + ch.lessons.length,
              0,
            )}{" "}
            {t("course_detail.lessons")}
          </span>
        </Badge>
      </div>
    </div>
  );
}
