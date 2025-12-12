"use client";

import { toggleFavoriteQuestion } from "@/actions/quiz/student.actions";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ToggleFavoriteButton({
  questionId,
  isFavorited: initialIsFavorited,
}: {
  questionId: string;
  isFavorited: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setIsFavorited((prev) => !prev);

    startTransition(async () => {
      const result = await toggleFavoriteQuestion(questionId);
      if (result.success) {
        // Sync with server response
        setIsFavorited(result.isFavorited);
        toast.success(
          result.isFavorited ? "Added to favorites" : "Removed from favorites",
        );
      } else {
        // Revert on error
        setIsFavorited((prev) => !prev);
        toast.error("Failed to update favorite");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 transition hover:text-red-600"
    >
      <Heart className={`size-5 ${isFavorited ? "fill-current" : ""}`} />
    </button>
  );
}
