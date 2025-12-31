"use client";

import { FileText, Timer } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

interface QuizHeaderProps {
  sectionTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number | null;
  enableTimer: boolean;
  onSubmit?: () => void;
  showSubmit?: boolean;
}

export function QuizHeader({
  sectionTitle,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  enableTimer,
  onSubmit,
  showSubmit,
}: QuizHeaderProps) {
  const { t } = useLanguage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* Timer */}
        <div className="flex items-center gap-4">
          {timeLeft !== null && enableTimer && (
            <div
              className={`flex items-center gap-2 font-mono text-lg font-bold ${
                timeLeft < 60 ? "text-red-600" : "text-gray-700"
              }`}
            >
              <Timer className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Right Side: Section Badge + Submit Button */}
        <div className="flex items-center gap-2">
          {showSubmit && onSubmit && (
            <button
              onClick={onSubmit}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              {t("quiz.player.submit_quiz")}
            </button>
          )}

          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700">
            <FileText className="h-4 w-4" />
            <span className="font-semibold">{sectionTitle}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-2">
        <p className="text-sm text-gray-500">
          {t("quiz.player.question")} {currentQuestionIndex + 1}{" "}
          {t("quiz.player.of")} {totalQuestions}
        </p>
      </div>
    </div>
  );
}
