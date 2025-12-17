import { requireAdmin } from "@/app/data/admin/require-admin";
import { Button } from "@/components/ui/button";
import { IconPlus, IconMoodSmile } from "@tabler/icons-react";
import MemeForm from "@/components/meme/MemeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminGetMemes } from "@/app/data/meme/admin-get-memes";
import { MemeGrid, MemeGridSkeleton } from "@/components/meme/MemeGrid";
import MemePagination from "@/components/meme/MemePagination";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
            <IconMoodSmile className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meme Library</h1>
            <p className="text-muted-foreground">
              Manage memes to make quizzes more engaging
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-pink-700">
              <IconPlus className="size-4" />
              Add Meme
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IconMoodSmile className="size-5 text-purple-500" />
                Add New Meme
              </DialogTitle>
            </DialogHeader>
            <MemeForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="dark:bg-card rounded-xl border bg-white p-4">
          <p className="text-muted-foreground text-sm">Total Memes</p>
          <p className="text-2xl font-bold">
            <Suspense fallback="—">
              <MemeCount page={page} />
            </Suspense>
          </p>
        </div>
        <div className="dark:to-card rounded-xl border bg-gradient-to-br from-emerald-50 to-white p-4 dark:from-emerald-900/20">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Correct
          </p>
          <p className="text-2xl font-bold text-emerald-600">✓</p>
        </div>
        <div className="dark:to-card rounded-xl border bg-gradient-to-br from-red-50 to-white p-4 dark:from-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">Wrong</p>
          <p className="text-2xl font-bold text-red-600">✗</p>
        </div>
        <div className="dark:to-card rounded-xl border bg-gradient-to-br from-amber-50 to-white p-4 dark:from-amber-900/20">
          <p className="text-sm text-amber-600 dark:text-amber-400">Too Slow</p>
          <p className="text-2xl font-bold text-amber-600">⏱</p>
        </div>
      </div>

      {/* Meme Grid */}
      <Suspense key={page} fallback={<MemeGridSkeleton />}>
        <MemeList page={page} />
      </Suspense>
    </div>
  );
}

async function MemeCount({ page }: { page: number }) {
  const { memes } = await adminGetMemes(page);
  return <span>{memes.length}+</span>;
}
