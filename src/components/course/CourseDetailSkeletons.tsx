import { Card, CardContent } from "@/components/ui/card";

// Custom skeleton with visible colors on hero background
function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-300/50 ${className || ""}`}
    />
  );
}

export function CourseHeroSkeleton() {
  return (
    <div className="space-y-6">
      {/* Badge Skeleton */}
      <HeroSkeleton className="h-8 w-32 rounded-full" />

      {/* Title Skeleton */}
      <div className="space-y-4">
        <HeroSkeleton className="h-12 w-3/4" />
        <HeroSkeleton className="h-6 w-full" />
        <HeroSkeleton className="h-6 w-2/3" />
      </div>

      {/* Stats Skeleton */}
      <div className="flex flex-wrap gap-6">
        <HeroSkeleton className="h-5 w-24" />
        <HeroSkeleton className="h-5 w-28" />
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
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Stats Skeleton */}
          <div className="mb-6 space-y-3 rounded-lg border-2 p-4">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-8 animate-pulse rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Includes Skeleton */}
          <div className="mb-6 space-y-3">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />

          {/* Guarantee Skeleton */}
          <div className="mx-auto mt-3 h-3 w-48 animate-pulse rounded bg-gray-200" />
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
        <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Chapters Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="gap-0 overflow-hidden border-2 p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 animate-pulse rounded-full bg-gray-200" />
                  <div>
                    <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CourseDescriptionSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      <HeroSkeleton className="h-4 w-full" />
      <HeroSkeleton className="h-4 w-11/12" />
      <HeroSkeleton className="h-4 w-10/12" />
      <HeroSkeleton className="h-4 w-full" />
      <HeroSkeleton className="h-4 w-9/12" />
      <HeroSkeleton className="h-4 w-8/12" />
    </div>
  );
}
