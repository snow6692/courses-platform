"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguage } from "@/providers/LanguageContext";

interface Enrollment {
  id: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    phoneNumber: string | null;
  };
  Course: {
    id: string;
    title: string;
    slug: string;
    price: number;
  };
}

interface AdminPageClientProps {
  enrollments: Enrollment[];
  locale: string;
}

export function AdminPageClient({ enrollments, locale }: AdminPageClientProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t("admin.recent_enrollments.title")}
        </h2>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={"/admin/students"}
        >
          {t("admin.recent_enrollments.view_all")}
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="dark:bg-card rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">
            {t("admin.recent_enrollments.no_enrollments")}
          </p>
        </div>
      ) : (
        <div className="dark:bg-card overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead className="dark:bg-muted bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.recent_enrollments.student")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.recent_enrollments.course")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.recent_enrollments.enrolled")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="dark:hover:bg-muted/50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {enrollment.user.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {enrollment.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{enrollment.Course.title}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(enrollment.createdAt), {
                      addSuffix: true,
                      locale: dateLocale,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
