"use client";

import { deleteMeme } from "@/actions/meme/meme.action";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../shared/ConfirmDialog";

export default function DeleteMeme({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMeme(id);
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Delete Meme"
      description="Are you sure you want to delete this meme? This action cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={handleDelete}
    />
  );
}
