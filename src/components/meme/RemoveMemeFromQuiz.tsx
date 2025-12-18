"use client";

import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { removeMemeFromQuiz } from "@/actions/meme/meme.action";
import { useLanguage } from "@/providers/LanguageContext";

export default function RemoveMemeFromQuiz({
  memeId,
  quizId,
}: {
  memeId: string;
  quizId: string;
}) {
  const { t } = useLanguage();
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
          className="absolute end-2 top-2 h-7 w-7 rounded-full bg-red-600 hover:bg-red-700"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      }
      title={t("admin.memes.remove_from_quiz")}
      description={t("admin.memes.remove_from_quiz_confirm")}
      confirmLabel={t("admin.memes.remove")}
      cancelLabel={t("admin.memes.cancel")}
      confirmVariant="destructive"
      onConfirm={handleRemove}
    />
  );
}
