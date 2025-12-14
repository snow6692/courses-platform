"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PersonalInfoSkeleton() {
  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Title */}
      <Skeleton className="h-8 w-48" />

      {/* Name fields */}
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

      {/* Email field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Phone field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}

export function SecuritySkeleton() {
  return (
    <div className="space-y-8 text-right" dir="rtl">
      <Skeleton className="h-8 w-48" />

      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />

        <div className="flex justify-end">
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}

export function SubscriptionsSkeleton() {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      <Skeleton className="h-8 w-32" />

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            <Skeleton className="h-16 w-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvoicesSkeleton() {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      <Skeleton className="h-8 w-24" />

      <div className="rounded-lg border">
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4 p-4">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
