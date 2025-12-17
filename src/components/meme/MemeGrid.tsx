"use client";

import MemeCard from "./MemeCard";
import type { Meme } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { IconMoodEmpty, IconSparkles } from "@tabler/icons-react";

export function MemeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MemeGrid({ memes }: { memes: Meme[] }) {
  if (memes.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl" />
          <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50">
            <IconMoodEmpty className="size-12 text-purple-500" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          No memes yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Add some memes to spice up your quizzes and make learning more fun!
        </p>
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <IconSparkles className="size-4" />
          <span>Click "Add Meme" to get started</span>
        </div>
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
