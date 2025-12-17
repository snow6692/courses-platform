"use client";

import { useLanguage } from "@/providers/LanguageContext";

export function StudentsPageHeader() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("admin.students.title")}</h1>
      <p className="text-gray-500">{t("admin.students.description")}</p>
    </div>
  );
}
