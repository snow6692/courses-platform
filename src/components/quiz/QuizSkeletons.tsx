"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function QuizPlayerSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FCF7F7" }}>
      {/* Header Skeleton */}
      <div className="border-b bg-white p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Question Content Skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div
          className="rounded-2xl bg-white p-8 shadow-lg"
          style={{ backgroundColor: "#FDFDFD" }}
        >
          {/* Question Badge */}
          <div className="mb-6 flex justify-end">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Question Text */}
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto mb-4 h-8 w-3/4" />
            <Skeleton className="mx-auto h-4 w-1/2" />
          </div>

          {/* Favorite Button */}
          <div className="mb-4 flex justify-end">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border-2 border-gray-200 p-4"
                style={{ backgroundColor: "#FDFDFD" }}
              >
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons Skeleton */}
        <div className="mt-6 flex items-center justify-between">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>

        {/* Question Navigation Skeleton */}
        <div
          className="mt-4 rounded-xl bg-white p-4 shadow-lg"
          style={{ backgroundColor: "#FDFDFD" }}
        >
          <Skeleton className="mb-4 h-4 w-24" />
          <div className="flex flex-wrap justify-end gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FavoritesQuizSkeleton() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-4xl space-y-4 px-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Question Cards Skeleton */}
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative rounded-xl border bg-white p-6">
              <div className="absolute top-4 right-4">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="flex items-start gap-4 pr-12">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
