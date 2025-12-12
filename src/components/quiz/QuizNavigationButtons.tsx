"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

interface QuizNavigationButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  isSubmitting: boolean;
}

export function QuizNavigationButtons({
  onNext,
  onPrev,
  isLastQuestion,
  isFirstQuestion,
  isSubmitting,
}: QuizNavigationButtonsProps) {
  const { t, dir } = useLanguage();

  return (
    <div className="mt-6 flex items-center justify-between">
      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLastQuestion
          ? t("quiz.player.submit_quiz")
          : t("quiz.player.next_question")}
        {dir === "rtl" ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <Button
        onClick={onPrev}
        disabled={isFirstQuestion}
        variant="outline"
        className="flex items-center gap-2 rounded-lg px-6 py-3"
      >
        {dir === "rtl" ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        {t("quiz.player.prev_question")}
      </Button>
    </div>
  );
}
