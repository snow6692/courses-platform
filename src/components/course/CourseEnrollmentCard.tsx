import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnrollmentButton from "@/components/course/EnrollmentButton";
import { getServerLocale } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Badge } from "@/components/ui/badge";
import { IconSparkles } from "@tabler/icons-react";

interface CourseEnrollmentCardProps {
  course: {
    id: string;
    slug: string;
    price: number;
    duration: number;
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

  // Calculate total lessons
  const totalLessons = course.chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.length,
    0,
  );

  return (
    <div className="sticky top-20">
      {/* Gradient border wrapper */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-orange-500/20 p-[2px] shadow-2xl shadow-purple-500/10">
        <Card className="bg-card overflow-hidden rounded-3xl border-none backdrop-blur-sm">
          {/* Course Image with overlay gradient */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={thumbnailImage}
              alt="Course thumbnail"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Course stats badge */}
            <div className="absolute right-3 bottom-3 left-3 flex justify-between">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 backdrop-blur-sm">
                {course.chapters.length} {t("course_detail.chapters")}
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 backdrop-blur-sm">
                {totalLessons} {t("course_detail.lessons")}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Price Section */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">{course.price}</span>
                <span className="text-muted-foreground text-xl font-semibold">
                  {t("courses.card.currency")}
                </span>
              </div>

              <Badge
                variant="secondary"
                className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
              >
                <IconSparkles className="mr-1 size-3" />
                {t("course_detail.one_payment_label")}
              </Badge>
            </div>

            {/* Divider */}
            <div className="mb-6 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

            {/* CTA Button */}
            <div>
              {isEnrolled ? (
                <Link
                  href={`/dashboard/${course.slug}`}
                  className={buttonVariants({
                    className:
                      "w-full rounded-xl py-6 text-lg font-bold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110",
                  })}
                >
                  {t("course_detail.watch_now")}
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}
            </div>

            {/* Trust indicators */}
            <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs">
              <svg
                className="size-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {t("course_detail.secure_payment") || "Secure Payment"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
