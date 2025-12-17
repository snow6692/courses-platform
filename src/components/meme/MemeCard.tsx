"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteMeme from "@/components/meme/DeleteMeme";
import { useConstructUrl } from "@/hooks/use-construct-url";
import type { Meme } from "@/lib/db";
import {
  IconPlayerPlay,
  IconPhoto,
  IconGif,
  IconClock,
  IconDice,
} from "@tabler/icons-react";
import { useLanguage } from "@/providers/LanguageContext";

const triggerConfig = {
  TOO_SLOW: {
    translationKey: "admin.memes.triggers.too_slow",
    icon: IconClock,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  RANDOM: {
    translationKey: "admin.memes.triggers.random",
    icon: IconDice,
    className:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
  },
};

const typeConfig = {
  VIDEO: {
    translationKey: "admin.memes.types.video",
    icon: IconPlayerPlay,
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  IMAGE: {
    translationKey: "admin.memes.types.image",
    icon: IconPhoto,
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  GIF: {
    translationKey: "admin.memes.types.gif",
    icon: IconGif,
    className:
      "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
};

export default function MemeCard({ meme }: { meme: Meme }) {
  const { t } = useLanguage();
  const fileUrl = useConstructUrl(meme.fileKey);
  const trigger =
    triggerConfig[meme.trigger as keyof typeof triggerConfig] ||
    triggerConfig.RANDOM;
  const type = typeConfig[meme.type] || typeConfig.IMAGE;
  const TriggerIcon = trigger.icon;
  const TypeIcon = type.icon;

  return (
    <Card className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Media Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        {meme.type === "VIDEO" ? (
          <video
            src={fileUrl}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            controls
            preload="metadata"
          />
        ) : (
          <img
            src={fileUrl}
            alt="Meme"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        )}

        {/* Delete Button - appears on hover */}
        <div className="absolute end-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DeleteMeme id={meme.id} />
        </div>

        {/* Type Badge */}
        <div className="absolute start-2 top-2">
          <div
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${type.className}`}
          >
            <TypeIcon className="size-3.5" />
            <span>{t(type.translationKey)}</span>
          </div>
        </div>

        {/* Active indicator */}
        {meme.isActive && (
          <div className="absolute end-2 bottom-2">
            <div className="flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-medium text-white">
              <span className="size-1.5 rounded-full bg-white" />
              {t("admin.memes.active")}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <div className="flex items-center justify-between">
          {/* Trigger Badge */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 text-xs font-medium ${trigger.className}`}
          >
            <TriggerIcon className="size-3" />
            {t(trigger.translationKey)}
          </Badge>

          {/* ID */}
          <span className="text-muted-foreground font-mono text-[10px]">
            #{meme.id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>
    </Card>
  );
}
