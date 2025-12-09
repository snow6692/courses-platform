"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/LanguageContext";
import { LockOpen } from "lucide-react";

export function FreeLessonBadge() {
  const { t } = useLanguage();
  return (
    <Badge className="ml-2 flex items-center justify-center bg-green-600">
      <LockOpen className="mr-1 h-3 w-3" />
      {t("lesson.free_lesson")}
    </Badge>
  );
}
