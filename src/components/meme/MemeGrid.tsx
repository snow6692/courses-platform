"use client";

import MemeCard from "./MemeCard";
import type { Meme } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export function MemeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-video w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MemeGrid({ memes }: { memes: Meme[] }) {
  if (memes.length === 0) {
    return (
      <div className="text-muted-foreground col-span-full py-12 text-center">
        No memes found. Add one to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {memes.map((meme) => (
        <MemeCard key={meme.id} meme={meme} />
      ))}
    </div>
  );
}
