"use client";

import { ProfileData } from "@/app/data/user/get-profile-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookOpen, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageContext";

interface SubscriptionsTabProps {
  enrollments: ProfileData["enrollments"];
}

export function SubscriptionsTab({ enrollments }: SubscriptionsTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="mb-6 text-2xl font-bold">
        {t("profile.subscriptions.title")}
      </h2>

      {enrollments.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p>{t("profile.subscriptions.no_subscriptions")}</p>
          <Link href="/courses">
            <Button className="mt-4 bg-red-600 hover:bg-red-700">
              {t("profile.subscriptions.browse_courses")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}

function EnrollmentCard({
  enrollment,
}: {
  enrollment: ProfileData["enrollments"][0];
}) {
  const { t, language } = useLanguage();
  const imageUrl = useConstructUrl(enrollment.Course.fileKey);
  const enrollmentDate = new Date(enrollment.createdAt).toLocaleDateString(
    language === "ar" ? "ar-SA" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 md:flex-row md:items-center">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={enrollment.Course.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2 text-right">
          <h3 className="font-semibold text-gray-900">
            {enrollment.Course.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              {t("profile.subscriptions.active")}
            </Badge>

            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {t("profile.subscriptions.start_date")}: {enrollmentDate}
            </span>

            <span>
              {enrollment.amount} {t("profile.subscriptions.currency")}
            </span>
          </div>
        </div>
      </div>

      <Link href={`/dashboard/${enrollment.Course.slug}`}>
        <Button variant="outline" className="shrink-0 gap-2">
          <Eye className="h-4 w-4" />
          {t("profile.subscriptions.view_course")}
        </Button>
      </Link>
    </div>
  );
}
