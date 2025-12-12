"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";

interface QuestionNavigationProps {
  questions: { id: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  isAnswered: (questionId: string) => boolean;
}

export function QuestionNavigation({
  questions,
  currentIndex,
  onNavigate,
  isAnswered,
}: QuestionNavigationProps) {
  const { t } = useLanguage();

  return (
    <div
      className="rounded-xl bg-white p-4 shadow-lg"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      <h3 className="mb-4 text-left text-sm font-semibold text-gray-500">
        {t("quiz.player.all_questions")}
      </h3>
      <div className="flex flex-wrap justify-end gap-2">
        {questions.map((q, idx) => {
          const answered = isAnswered(q.id);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => onNavigate(idx)}
              className={`h-12 w-12 rounded-lg font-semibold transition-all ${
                isCurrent
                  ? "bg-red-600 text-white"
                  : answered
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SectionNavigationProps {
  sections: { id: string; title: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  getSectionStatus: (index: number) => string;
}

export function SectionNavigation({
  sections,
  currentIndex,
  onNavigate,
  getSectionStatus,
}: SectionNavigationProps) {
  const { t } = useLanguage();

  if (sections.length <= 1) return null;

  return (
    <div
      className="mt-4 rounded-xl bg-white p-4 shadow-lg"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      <h3 className="mb-4 text-left text-sm font-semibold text-gray-500">
        {t("quiz.player.sections")}
      </h3>
      <div className="flex flex-wrap justify-end gap-2">
        {sections.map((section, idx) => {
          const status = getSectionStatus(idx);
          const isExpired = status === "expired";
          const isCurrent = status === "current";
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(idx)}
              disabled={isExpired}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                isCurrent
                  ? "bg-red-600 text-white"
                  : isExpired
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={section.title}
            >
              {section.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface NavigationButtonsProps {
  isLastQuestion: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  canGoPrev: boolean;
}

export function NavigationButtons({
  isLastQuestion,
  isSubmitting,
  onNext,
  onPrev,
  onSubmit,
  canGoPrev,
}: NavigationButtonsProps) {
  const { t, dir } = useLanguage();

  return (
    <div className="mt-6 flex items-center justify-between">
      <Button
        onClick={isLastQuestion ? onSubmit : onNext}
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
      >
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
        disabled={!canGoPrev}
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
