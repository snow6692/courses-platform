"use client";

import { toggleFavoriteQuestion } from "@/actions/quiz/student.actions";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export function ToggleFavoriteButton({
  questionId,
  isFavorited,
}: {
  questionId: string;
  isFavorited: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const { success, isFavorited } = await toggleFavoriteQuestion(questionId);
      if (success) {
        toast.success(isFavorited ? "Added to favorites" : "Removed from favorites");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 hover:text-red-600 transition"
    >
      <Heart className={`size-5 ${isFavorited ? "fill-current" : ""}`} />
    </button>
  );
}