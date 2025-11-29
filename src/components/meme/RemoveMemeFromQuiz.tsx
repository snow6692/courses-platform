"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { removeMemeFromQuiz } from "@/actions/meme/meme.action";

export default function RemoveMemeFromQuiz({
  memeId,
  quizId,
}: {
  memeId: string;
  quizId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeMemeFromQuiz(memeId, quizId);
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
          <X className="h-4 w-4" />
        </Button>
      }
      title="Remove Meme from Quiz"
      description="Are you sure you want to remove this meme from the quiz? The meme will still exist in the library."
      confirmLabel="Remove"
      cancelLabel="Cancel"
      onConfirm={handleRemove}
    />
  );
}
