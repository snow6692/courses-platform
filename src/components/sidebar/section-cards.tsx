"use client";

import {
  IconBook,
  IconPlaylistX,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/providers/LanguageContext";

interface SectionCardsProps {
  stats: {
    totalCourses: number;
    totalCustomers: number;
    totalLessons: number;
    totalUsers: number;
  };
}

export function SectionCards({ stats }: SectionCardsProps) {
  const { t } = useLanguage();
  const { totalCourses, totalCustomers, totalLessons, totalUsers } = stats;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("admin.dashboard.total_users")}</CardDescription>

          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers}
            </CardTitle>

            <IconUsers className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            {t("admin.dashboard.users_description")}
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {t("admin.dashboard.total_customers")}
          </CardDescription>
          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCustomers}
            </CardTitle>
            <IconShoppingCart className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            {t("admin.dashboard.customers_description")}
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {t("admin.dashboard.total_courses")}
          </CardDescription>
          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
            <IconBook className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            {t("admin.dashboard.courses_description")}
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {t("admin.dashboard.total_lessons")}
          </CardDescription>
          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLessons}
            </CardTitle>
            <IconPlaylistX className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            {t("admin.dashboard.lessons_description")}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
