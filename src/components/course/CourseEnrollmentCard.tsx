import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnrollmentButton from "@/components/course/EnrollmentButton";
import { getServerLocale } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";

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
    chapters: { lessons: unknown[] }[];
  };
  isEnrolled: boolean;
}

export async function CourseEnrollmentCard({
  course,
  isEnrolled,
}: CourseEnrollmentCardProps) {
  const { t } = await getServerLocale();
  const thumbnailImage = useConstructUrl(course.fileKey);

  return (
    <div className="sticky top-20">
      <Card className="overflow-hidden border-none bg-transparent shadow-none">
        {/* Course Image - Top of Card */}
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailImage}
            alt="Course thumbnail"
            fill
            className="object-cover"
            priority
          />
        </div>

        <CardContent className="p-0">
          {/* Price */}
          <div className="mb-4 flex items-center justify-end gap-2 text-right">
            <span className="text-muted-foreground text-sm font-medium">
              {t("course_detail.one_payment_label") || "دفعة واحدة"}
            </span>
            <span className="text-foreground text-3xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
              }).format(course.price)}
            </span>
          </div>

          <div className="mb-8 flex flex-col gap-3">
            {isEnrolled ? (
              <Link
                href={`/dashboard/${course.slug}`}
                className={buttonVariants({
                  className: "w-full py-6 text-lg font-bold",
                })}
              >
                {t("course_detail.watch_now")}
              </Link>
            ) : (
              <EnrollmentButton courseId={course.id} />
            )}
          </div>

          <div className="mb-6 space-y-3">
            <div className="bg-border/40 mb-4 h-px w-full" />

            {/* Dynamic Description Rendering */}
            <div className="text-right" dir="rtl">
              <RenderDescription json={course.description} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
