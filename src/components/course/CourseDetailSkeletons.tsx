import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseHeroSkeleton() {
  return (
    <div className="space-y-6">
      {/* Image Skeleton */}
      <Skeleton className="aspect-video w-full rounded-xl" />

      {/* Title Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>

      {/* Badges Skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  );
}

export function CourseEnrollmentCardSkeleton() {
  return (
    <div className="sticky top-20">
      <Card className="py-0">
        <CardContent className="p-6">
          {/* Price Skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Stats Skeleton */}
          <div className="mb-6 space-y-3 rounded-lg border-2 p-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Includes Skeleton */}
          <div className="mb-6 space-y-3">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-10 w-full" />

          {/* Guarantee Skeleton */}
          <Skeleton className="mx-auto mt-3 h-3 w-48" />
        </CardContent>
      </Card>
    </div>
  );
}

export function CourseContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Chapters Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="gap-0 overflow-hidden border-2 p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="mb-2 h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
