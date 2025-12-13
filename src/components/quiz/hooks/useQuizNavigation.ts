"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageContext";

interface Section {
  id: string;
  questions: { id: string }[];
}

interface UseQuizNavigationProps {
  sections: Section[];
  expiredSections: string[];
  sectionTimers: Record<string, number>;
  enableTimer: boolean;
}

interface UseQuizNavigationReturn {
  currentSectionIndex: number;
  currentQuestionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  navigateToSection: (sectionIndex: number) => void;
  navigateToQuestion: (questionIndex: number) => void;
  goToNextQuestion: () => void;
  goToPrevQuestion: () => void;
  resetNavigation: () => void;
}

export function useQuizNavigation({
  sections,
  expiredSections,
  sectionTimers,
  enableTimer,
}: UseQuizNavigationProps): UseQuizNavigationReturn {
  const { t } = useLanguage();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentSection = sections[currentSectionIndex];

  const navigateToSection = useCallback(
    (sectionIndex: number) => {
      const targetSection = sections[sectionIndex];
      if (!targetSection) return;

      if (expiredSections.includes(targetSection.id)) {
        toast.error(t("quiz.player.section_expired"));
        return;
      }

      if (enableTimer) {
        const sectionTime = sectionTimers[targetSection.id];
        if (sectionTime !== undefined && sectionTime <= 0) {
          toast.error(t("quiz.player.section_time_expired"));
          return;
        }
      }

      setCurrentSectionIndex(sectionIndex);
      setCurrentQuestionIndex(0);
    },
    [sections, expiredSections, enableTimer, sectionTimers, t],
  );

  const navigateToQuestion = useCallback(
    (questionIndex: number) => {
      if (
        questionIndex >= 0 &&
        questionIndex < (currentSection?.questions.length || 0)
      ) {
        setCurrentQuestionIndex(questionIndex);
      }
    },
    [currentSection?.questions.length],
  );

  const goToNextQuestion = useCallback(() => {
    if (!currentSection) return;

    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      const nextSectionIndex = sections.findIndex(
        (s, idx) =>
          idx > currentSectionIndex && !expiredSections.includes(s.id),
      );
      if (nextSectionIndex !== -1) {
        setCurrentSectionIndex(nextSectionIndex);
        setCurrentQuestionIndex(0);
      }
    }
  }, [
    currentSection,
    currentQuestionIndex,
    currentSectionIndex,
    sections,
    expiredSections,
  ]);

  const goToPrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const resetNavigation = useCallback(() => {
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
  }, []);

  return {
    currentSectionIndex,
    currentQuestionIndex,
    setCurrentSectionIndex,
    setCurrentQuestionIndex,
    navigateToSection,
    navigateToQuestion,
    goToNextQuestion,
    goToPrevQuestion,
    resetNavigation,
  };
}
