"use client";

import MemeCard from "./MemeCard";
import type { Meme } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { IconMoodEmpty } from "@tabler/icons-react";
import { useLanguage } from "@/providers/LanguageContext";

export function MemeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 overflow-hidden rounded-xl border bg-white dark:bg-slate-900"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MemeGrid({ memes }: { memes: Meme[] }) {
  const { t } = useLanguage();

  if (memes.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="relative mb-6">
          <div className="flex size-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <IconMoodEmpty className="size-12 text-slate-400" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          {t("admin.memes.no_memes")}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          {t("admin.memes.no_memes_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {memes.map((meme) => (
        <MemeCard key={meme.id} meme={meme} />
      ))}
    </div>
  );
}
