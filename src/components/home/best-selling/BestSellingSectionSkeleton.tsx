"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BestSellingSectionSkeleton() {
  return (
    <section className="bg-background w-full py-12">
      <div className="container mx-auto flex flex-col gap-8 px-6 md:px-12 lg:px-24">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-0 rounded-xl border p-0 shadow-sm"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center justify-between px-5 pb-5">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
