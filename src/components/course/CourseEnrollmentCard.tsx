import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnrollmentButton from "@/components/course/EnrollmentButton";
import { getServerLocale } from "@/lib/i18n";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import { Check } from "lucide-react";
import Link from "next/link";

interface CourseEnrollmentCardProps {
  course: {
    id: string;
    price: number;
    duration: number;
    level: string;
    category: string;
    chapters: { lessons: unknown[] }[];
  };
  isEnrolled: boolean;
}

export async function CourseEnrollmentCard({
  course,
  isEnrolled,
}: CourseEnrollmentCardProps) {
  const { t } = await getServerLocale();

  const totalLessons = course.chapters.reduce(
    (total, ch) => total + ch.lessons.length,
    0,
  );

  return (
    <div className="sticky top-20">
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-medium">
              {t("course_detail.price")}:{" "}
            </span>
            <span className="text-primary text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(course.price)}
            </span>
          </div>

          <div className="mb-6 space-y-3 rounded-lg border-2 p-4">
            <h4 className="font-medium">{t("course_detail.what_you_get")}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <IconClock className="size-4" />
                </div>
                <div className="">
                  <p className="text-sm font-medium">
                    {t("course_detail.course_duration")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {course.duration} {t("course_detail.hours")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <IconChartBar className="size-4" />
                </div>
                <div className="">
                  <p className="text-sm font-medium">
                    {t("course_detail.course_level")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {course.level}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <IconCategory className="size-4" />
                </div>
                <div className="">
                  <p className="text-sm font-medium">
                    {t("course_detail.course_category")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {course.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <IconBook className="size-4" />
                </div>
                <div className="">
                  <p className="text-sm font-medium">
                    {t("course_detail.total_lessons")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {totalLessons} {t("course_detail.lessons")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <h4 className="">{t("course_detail.this_course_includes")}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                  <Check className="size-3" />
                </div>
                <span>{t("course_detail.full_lifetime_access")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                  <Check className="size-3" />
                </div>
                <span>{t("course_detail.mobile_desktop_access")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                  <Check className="size-3" />
                </div>
                <span>{t("course_detail.certificate")}</span>
              </li>
            </ul>
          </div>

          {isEnrolled ? (
            <Link
              href={"/dashboard"}
              className={buttonVariants({ className: "w-full" })}
            >
              {t("course_detail.watch_now")}
            </Link>
          ) : (
            <EnrollmentButton courseId={course.id} />
          )}

          <p className="text-muted-foreground mt-3 text-center text-xs">
            {t("course_detail.money_back_guarantee")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
