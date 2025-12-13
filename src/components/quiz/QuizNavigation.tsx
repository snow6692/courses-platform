"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { useRef } from "react";

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
  const { t, dir } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="mt-6 rounded-xl bg-white p-4 shadow-lg"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      <h3
        className={`mb-4 text-sm font-semibold text-gray-500 ${dir === "rtl" ? "text-right" : "text-left"}`}
      >
        {t("quiz.player.all_questions")}
      </h3>

      <div className="relative flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(dir === "rtl" ? "right" : "left")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Questions Grid */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex flex-1 gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {questions.map((q, idx) => {
            const answered = isAnswered(q.id);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => onNavigate(idx)}
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all ${
                  isCurrent
                    ? "border-red-500 bg-red-50 text-gray-900"
                    : answered
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(dir === "rtl" ? "left" : "right")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

interface SectionNavigationProps {
  sections: { id: string; title: string; questions: { id: string }[] }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  getSectionStatus: (index: number) => string;
  isSectionComplete: (sectionIndex: number) => boolean;
}

export function SectionNavigation({
  sections,
  currentIndex,
  onNavigate,
  getSectionStatus,
  isSectionComplete,
}: SectionNavigationProps) {
  const { t, dir } = useLanguage();

  if (sections.length <= 1) return null;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < sections.length - 1;

  return (
    <div
      className="mt-6 rounded-xl bg-white p-4 shadow-lg"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      {/* Mobile: Stack vertically, Desktop: Horizontal */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Next Section Button - First on mobile RTL */}
        <div className="order-1 md:order-3">
          <Button
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={
              !canGoNext || getSectionStatus(currentIndex + 1) === "expired"
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 md:w-auto"
          >
            {t("quiz.player.next_section")}
            {dir === "rtl" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sections List */}
        <div className="order-2 flex flex-wrap justify-center gap-2">
          {sections.map((section, idx) => {
            const status = getSectionStatus(idx);
            const isExpired = status === "expired";
            const isCurrent = status === "current";
            const isComplete = isSectionComplete(idx);
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(idx)}
                disabled={isExpired}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  isCurrent
                    ? "bg-red-600 text-white"
                    : isExpired
                      ? "cursor-not-allowed bg-gray-200 text-gray-400"
                      : isComplete
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={section.title}
              >
                {section.title}
              </button>
            );
          })}
        </div>

        {/* Previous Section Button - Last on mobile RTL */}
        <div className="order-3 md:order-1">
          <Button
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={
              !canGoPrev || getSectionStatus(currentIndex - 1) === "expired"
            }
            variant="outline"
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 md:w-auto"
          >
            {dir === "rtl" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            {t("quiz.player.prev_section")}
          </Button>
        </div>
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
