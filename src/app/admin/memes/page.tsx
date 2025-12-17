import { requireAdmin } from "@/app/data/admin/require-admin";
import { adminGetMemes } from "@/app/data/meme/admin-get-memes";
import { MemeGrid, MemeGridSkeleton } from "@/components/meme/MemeGrid";
import MemePagination from "@/components/meme/MemePagination";
import MemePageHeader from "@/components/meme/MemePageHeader";
import MemeStatsBar from "@/components/meme/MemeStatsBar";
import { Suspense } from "react";

async function MemeList({ page }: { page: number }) {
  const { memes, totalPages, currentPage } = await adminGetMemes(page);

  return (
    <>
      <MemeGrid memes={memes} />
      <MemePagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}

async function MemeStats({ page }: { page: number }) {
  const { memes } = await adminGetMemes(page);
  return <MemeStatsBar count={memes.length} />;
}

export default async function AdminMemesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <MemePageHeader />

      {/* Stats bar */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-muted h-20 animate-pulse rounded-xl border"
              />
            ))}
          </div>
        }
      >
        <MemeStats page={page} />
      </Suspense>

      {/* Meme Grid */}
      <Suspense key={page} fallback={<MemeGridSkeleton />}>
        <MemeList page={page} />
      </Suspense>
    </div>
  );
}
