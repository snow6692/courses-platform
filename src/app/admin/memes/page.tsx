import { requireAdmin } from "@/app/data/admin/require-admin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meme Library</h1>
          <p className="text-muted-foreground">
            Manage global memes that can be used in quizzes.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Meme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Meme</DialogTitle>
            </DialogHeader>
            <MemeForm />
          </DialogContent>
        </Dialog>
      </div>

      <Suspense key={page} fallback={<MemeGridSkeleton />}>
        <MemeList page={page} />
      </Suspense>
    </div>
  );
}
