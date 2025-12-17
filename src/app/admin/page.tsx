import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetRecentEnrollments } from "../data/admin/admin-get-recent-enrollments";
import { adminGetDashboardStats } from "../data/admin/admin-get-dashbaord-stats";
import { AdminPageClient } from "@/components/admin/AdminPageClient";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for stats cards
function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="dark:bg-card rounded-xl border bg-white p-6">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-4 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for recent enrollments
function EnrollmentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="dark:bg-card rounded-xl border bg-white">
        <div className="space-y-4 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server component for stats
async function StatsSection() {
  const stats = await adminGetDashboardStats();
  return <SectionCards stats={stats} />;
}

// Server component for enrollments
async function EnrollmentsSection() {
  const [enrollments, cookieStore] = await Promise.all([
    adminGetRecentEnrollments(),
    cookies(),
  ]);
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  return <AdminPageClient enrollments={enrollments} locale={locale} />;
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionCardsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<EnrollmentsSkeleton />}>
        <EnrollmentsSection />
      </Suspense>
    </div>
  );
}
