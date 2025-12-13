import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnrollmentButton from "@/components/course/EnrollmentButton";
import { getServerLocale } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import {
  IconClock,
  IconBook,
  IconClipboardCheck,
  IconDownload,
  IconInfinity,
  IconCertificate,
} from "@tabler/icons-react";

interface CourseEnrollmentCardProps {
  course: {
    id: string;
    slug: string;
    price: number;
    duration: number;
    level: string;
    category: string;
    fileKey: string;
    description: string | null;
    chapters: { lessons: { id: string; title: string; isFree: boolean }[] }[];
  };
  isEnrolled: boolean;
}

export async function CourseEnrollmentCard({
  course,
  isEnrolled,
}: CourseEnrollmentCardProps) {
  const { t } = await getServerLocale();
  const thumbnailImage = useConstructUrl(course.fileKey);

  // Calculate total chapters
  const totalChapters = course.chapters.length;

  const courseIncludes = [
    {
      icon: IconClock,
      text: `${course.duration} ${t("course_detail.hours")} ${t("course_detail.video_content")}`,
    },
    {
      icon: IconBook,
      text: `${totalChapters} ${t("course_detail.chapters_count")}`,
    },
    {
      icon: IconClipboardCheck,
      text: t("course_detail.quizzes"),
    },
    {
      icon: IconDownload,
      text: t("course_detail.resources"),
    },
    {
      icon: IconInfinity,
      text: t("course_detail.full_lifetime_access"),
    },
    {
      icon: IconCertificate,
      text: t("course_detail.certificate"),
    },
  ];

  return (
    <div className="sticky top-20">
      <Card
        className="overflow-hidden rounded-2xl border-none p-4 shadow-lg"
        style={{ backgroundColor: "#FDFDFD" }}
      >
        {/* Course Image */}
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnailImage}
            alt="Course thumbnail"
            fill
            className="object-cover"
            priority
          />
        </div>

        <CardContent className="p-0">
          {/* Price Section */}
          <div className="mb-6 flex items-center gap-3 text-center">
            <span className="text-foreground text-3xl font-bold">
              {course.price}
              <span className="text-xl">{t("courses.card.currency")}</span>
            </span>

            <span className="text-muted-foreground text-sm font-medium">
              {t("course_detail.one_payment_label")}
            </span>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            {isEnrolled ? (
              <Link
                href={`/dashboard/${course.slug}`}
                className={buttonVariants({
                  className:
                    "bg-primary hover:bg-primary/90 w-full rounded-lg py-6 text-lg font-bold",
                })}
              >
                {t("course_detail.watch_now")}
              </Link>
            ) : (
              <EnrollmentButton courseId={course.id} />
            )}
          </div>

          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gray-200" />

          {/* This Course Includes Section */}
          <div className="mb-8">
            <h3 className="mb-4 text-right text-lg font-bold text-gray-800">
              {t("course_detail.this_course_includes")}
            </h3>
            <div className="space-y-3">
              {courseIncludes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-end gap-3 text-right"
                >
                  <span className="text-muted-foreground text-sm">
                    {item.text}
                  </span>
                  <div className="bg-primary/10 flex size-6 items-center justify-center rounded-full">
                    <item.icon className="text-primary size-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
