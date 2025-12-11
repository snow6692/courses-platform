import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl py-10" dir="rtl">
      {/* Header Skeleton */}
      <div className="relative mb-6 w-full overflow-hidden rounded-lg border bg-white p-6">
        <div className="absolute top-0 left-0 h-2 w-full bg-gray-200"></div>
        <div className="relative z-10 flex flex-col items-center justify-end gap-6 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-2 text-center md:items-end md:text-right">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="mt-2 flex justify-center gap-2 md:justify-end">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="size-24 rounded-full border-4 border-white md:size-32" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full">
        <div className="mb-8 flex w-full justify-between gap-2 border-b bg-gray-50/50 p-2">
          <Skeleton className="h-10 w-full md:w-1/5" />
          <Skeleton className="h-10 w-full md:w-1/5" />
          <Skeleton className="h-10 w-full md:w-1/5" />
          <Skeleton className="h-10 w-full md:w-1/5" />
          <Skeleton className="h-10 w-full md:w-1/5" />
        </div>

        <Card className="min-h-[500px] p-6 md:p-10">
          <div className="space-y-8">
            <Skeleton className="mb-6 h-8 w-40" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
