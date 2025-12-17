"use client";

import { useLanguage } from "@/providers/LanguageContext";

export default function MemeStatsBar({ count }: { count: number }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="dark:bg-card rounded-xl border bg-white p-4">
        <p className="text-muted-foreground text-sm">
          {t("admin.memes.total_memes")}
        </p>
        <p className="text-2xl font-bold">{count}+</p>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-sm font-semibold">
          {t("admin.memes.triggers.too_slow")}
        </p>
        <p className="text-2xl font-bold">⏱</p>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-sm font-semibold">
          {t("admin.memes.triggers.random")}
        </p>
        <p className="text-2xl font-bold">🎲</p>
      </div>
    </div>
  );
}
