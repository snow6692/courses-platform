"use client";

import { toggleFavoriteQuestion } from "@/actions/quiz/student.actions";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AddToFolderDialog } from "@/components/favorites/AddToFolderDialog";
import { useLanguage } from "@/providers/LanguageContext";

export function ToggleFavoriteButton({
  questionId,
  isFavorited: initialIsFavorited,
}: {
  questionId: string;
  isFavorited: boolean;
}) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [showFolderDialog, setShowFolderDialog] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      // Remove from favorites
      setIsFavorited(false); // Optimistic update

      startTransition(async () => {
        const result = await toggleFavoriteQuestion(questionId);
        if (result.success) {
          setIsFavorited(result.isFavorited);
          toast.success(t("favorites.question_removed"));
        } else {
          // Revert on error
          setIsFavorited(true);
          toast.error("Failed to update favorite");
        }
      });
    } else {
      // Show folder selection dialog
      setShowFolderDialog(true);
    }
  };

  const handleFolderSuccess = () => {
    setIsFavorited(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="text-red-500 transition hover:text-red-600"
      >
        <Heart className={`size-5 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      <AddToFolderDialog
        open={showFolderDialog}
        onOpenChange={setShowFolderDialog}
        questionId={questionId}
        onSuccess={handleFolderSuccess}
      />
    </>
  );
}
