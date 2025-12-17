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
  IconCheck,
  IconX,
  IconClock,
  IconDice,
} from "@tabler/icons-react";

const triggerConfig = {
  CORRECT: {
    label: "Correct",
    icon: IconCheck,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    gradient: "from-emerald-500/20 to-transparent",
  },
  WRONG: {
    label: "Wrong",
    icon: IconX,
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    gradient: "from-red-500/20 to-transparent",
  },
  TOO_SLOW: {
    label: "Too Slow",
    icon: IconClock,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    gradient: "from-amber-500/20 to-transparent",
  },
  RANDOM: {
    label: "Random",
    icon: IconDice,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    gradient: "from-purple-500/20 to-transparent",
  },
};

const typeConfig = {
  VIDEO: {
    label: "Video",
    icon: IconPlayerPlay,
    color: "bg-blue-500/10 text-blue-600",
  },
  IMAGE: {
    label: "Image",
    icon: IconPhoto,
    color: "bg-pink-500/10 text-pink-600",
  },
  GIF: {
    label: "GIF",
    icon: IconGif,
    color: "bg-orange-500/10 text-orange-600",
  },
};

export default function MemeCard({ meme }: { meme: Meme }) {
  const fileUrl = useConstructUrl(meme.fileKey);
  const trigger = triggerConfig[meme.trigger] || triggerConfig.RANDOM;
  const type = typeConfig[meme.type] || typeConfig.IMAGE;
  const TriggerIcon = trigger.icon;
  const TypeIcon = type.icon;

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-gray-900 dark:to-gray-800">
      {/* Gradient overlay based on trigger */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${trigger.gradient} pointer-events-none opacity-50`}
      />

      {/* Media Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {meme.type === "VIDEO" ? (
          <video
            src={fileUrl}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            controls
            preload="metadata"
          />
        ) : (
          <img
            src={fileUrl}
            alt="Meme"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Delete Button - appears on hover */}
        <div className="absolute end-3 top-3 translate-y-[-8px] transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <DeleteMeme id={meme.id} />
        </div>

        {/* Type Badge */}
        <div className="absolute start-3 top-3">
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md ${type.color} border border-white/20`}
          >
            <TypeIcon className="size-3.5" />
            <span>{type.label}</span>
          </div>
        </div>

        {/* Active indicator */}
        {meme.isActive && (
          <div className="absolute end-3 bottom-3">
            <div className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              Active
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          {/* Trigger Badge */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 font-medium ${trigger.color} border`}
          >
            <TriggerIcon className="size-3.5" />
            {trigger.label}
          </Badge>

          {/* Created date or ID */}
          <span className="text-muted-foreground font-mono text-[10px]">
            #{meme.id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r ${trigger.gradient.replace("to-transparent", "via-current to-transparent")}`}
      />
    </Card>
  );
}
