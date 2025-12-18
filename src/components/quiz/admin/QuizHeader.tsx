// components/quiz/admin/QuizHeader.tsx

"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import MemeSelector from "@/components/meme/MemeSelector";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageContext";
import { deleteQuiz } from "@/actions/quiz/quiz.action";

interface QuizHeaderProps {
  quizId: string;
  quizTitle: string;
  courseId: string;
  onMemeAdded: () => void;
}

export function QuizHeader({
  quizId,
  quizTitle,
  courseId,
  onMemeAdded,
}: QuizHeaderProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteQuiz = () => {
    startTransition(async () => {
      const result = await deleteQuiz(quizId, courseId);
      if (result.status === "success") {
        toast.success(t("admin.quiz.quiz_deleted"));
        router.push(`/admin/courses/${courseId}/edit`);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-bold sm:text-3xl">{quizTitle}</h1>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <MemeSelector quizId={quizId} onSuccess={onMemeAdded} />
        <ConfirmDialog
          trigger={
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              disabled={isPending}
            >
              <Trash2 className="me-1 h-4 w-4" />
              {t("admin.quiz.delete_quiz")}
            </Button>
          }
          title={t("admin.quiz.delete_quiz")}
          description={t("admin.quiz.delete_quiz_confirm")}
          confirmVariant="destructive"
          confirmLabel={t("admin.quiz.delete")}
          cancelLabel={t("admin.quiz.cancel")}
          onConfirm={handleDeleteQuiz}
        />
      </div>
    </div>
  );
}
