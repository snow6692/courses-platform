"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/LanguageContext";
import { Lock } from "lucide-react";

export function PaidLessonBadge() {
  const { t } = useLanguage();

  return (
    <Badge
      variant="destructive"
      className="ml-2 flex items-center justify-center bg-red-600"
    >
      <Lock />
      {t("lesson.paid_lesson")}
    </Badge>
  );
}
