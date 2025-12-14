"use client";

import { Bell, Trophy, Sparkles, BookOpen, FileQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface Notification {
  id: string;
  type: "PROGRESS_50" | "PROGRESS_100" | "NEW_LESSON" | "NEW_QUIZ";
  title: string;
  message: string;
  courseTitle: string;
  courseSlug: string;
  createdAt: Date;
}

interface NotificationsSectionProps {
  notifications: Notification[];
}

export function NotificationsSection({
  notifications,
}: NotificationsSectionProps) {
  const { t, language } = useLanguage();

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "PROGRESS_100":
        return <Trophy className="size-4 text-amber-500" />;
      case "PROGRESS_50":
        return <Sparkles className="size-4 text-blue-500" />;
      case "NEW_LESSON":
        return <BookOpen className="size-4 text-green-500" />;
      case "NEW_QUIZ":
        return <FileQuestion className="size-4 text-purple-500" />;
      default:
        return <Bell className="size-4 text-gray-500" />;
    }
  };

  const getColor = (type: Notification["type"]) => {
    switch (type) {
      case "PROGRESS_100":
        return "bg-amber-500";
      case "PROGRESS_50":
        return "bg-blue-500";
      case "NEW_LESSON":
        return "bg-green-500";
      case "NEW_QUIZ":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: language === "ar" ? ar : enUS,
      });
    } catch {
      return language === "ar" ? "الآن" : "Just now";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="size-5 text-amber-500" />
          {t("dashboard.notifications") || "الاشعارات"}
        </CardTitle>
        {notifications.length > 0 && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
            {notifications.length}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Bell className="mx-auto mb-2 size-8 text-gray-300" />
            <p className="text-sm">
              {t("dashboard.no_notifications") || "لا توجد اشعارات جديدة"}
            </p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 4).map((notification) => (
              <Link
                key={notification.id}
                href={`/dashboard/${notification.courseSlug}`}
                className="block"
              >
                <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                  <div
                    className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ${getColor(notification.type)}/10`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="line-clamp-1 text-xs text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {notifications.length > 4 && (
              <Button variant="ghost" className="w-full text-red-600" asChild>
                <Link href="/dashboard/notifications">
                  {t("dashboard.view_all") || "عرض الكل"} (
                  {notifications.length - 4} {t("dashboard.more") || "المزيد"})
                </Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
