"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageContext";
import {
  submitQuiz,
  submitFavoritesQuiz,
} from "@/actions/quiz/student.actions";

interface Section {
  id: string;
  timeLimit: number | null;
  questions: { id: string }[];
}

interface UseQuizTimerProps {
  quizId: string;
  sections: Section[];
  currentSectionId: string | undefined;
  currentSectionIndex: number;
  sectionTimers: Record<string, number>;
  setSectionTimers: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  expiredSections: string[];
  setExpiredSections: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentSectionIndex: (index: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  enableTimer: boolean;
  quizStarted: boolean;
  getFormValues: () => { answers: Record<string, string | string[]> };
  calculateTimeTaken: () => number;
  clearSavedState: () => void;
  saveResult: (result: any) => void;
  setQuizResult: (result: any) => void;
  setIsSubmitting: (value: boolean) => void;
}

interface UseQuizTimerReturn {
  timeLeft: number | null;
  timerExpired: boolean;
  isSubmitting: boolean;
}

export function useQuizTimer({
  quizId,
  sections,
  currentSectionId,
  currentSectionIndex,
  sectionTimers,
  setSectionTimers,
  expiredSections,
  setExpiredSections,
  setCurrentSectionIndex,
  setCurrentQuestionIndex,
  enableTimer,
  quizStarted,
  getFormValues,
  calculateTimeTaken,
  clearSavedState,
  saveResult,
  setQuizResult,
  setIsSubmitting,
}: UseQuizTimerProps): UseQuizTimerReturn {
  const { t } = useLanguage();
  const [timerExpired, setTimerExpired] = useState(false);
  const [isSubmitting, setIsSubmittingLocal] = useState(false);

  const currentSection = sections.find((s) => s.id === currentSectionId);
  const timeLeft = currentSectionId
    ? (sectionTimers[currentSectionId] ?? null)
    : null;

  const isFavoritesQuiz =
    quizId === "favorites-quiz" || quizId.startsWith("folder-quiz-");

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || !enableTimer || !currentSection) return;
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setSectionTimers((prev) => {
        const currentTime = prev[currentSection.id];
        if (currentTime === undefined || currentTime <= 0) {
          clearInterval(timer);
          setTimerExpired(true);
          return prev;
        }
        return { ...prev, [currentSection.id]: currentTime - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, enableTimer, currentSection, timeLeft, setSectionTimers]);

  // Handle section time up
  const handleSectionTimeUp = useCallback(async () => {
    if (!currentSection) return;

    const newExpiredSections = [...expiredSections, currentSection.id];
    setExpiredSections(newExpiredSections);

    // Find ANY section that still has time remaining
    let nextSectionIndex = sections.findIndex(
      (s, idx) =>
        idx > currentSectionIndex && !newExpiredSections.includes(s.id),
    );

    if (nextSectionIndex === -1) {
      nextSectionIndex = sections.findIndex(
        (s) => !newExpiredSections.includes(s.id),
      );
    }

    if (nextSectionIndex !== -1) {
      toast.info(t("quiz.player.time_up_next_section"));
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
    } else {
      // All sections have expired, now submit
      toast.info(t("quiz.player.time_up_submitting"));
      const values = getFormValues();
      const timeTaken = calculateTimeTaken();
      setIsSubmittingLocal(true);
      setIsSubmitting(true);
      try {
        let result;
        if (isFavoritesQuiz) {
          const questionIds = sections.flatMap((s) =>
            s.questions.map((q) => q.id),
          );
          result = await submitFavoritesQuiz(
            questionIds,
            values.answers,
            timeTaken,
          );
        } else {
          result = await submitQuiz(quizId, values.answers, timeTaken);
        }
        if (result.success) {
          clearSavedState();
          saveResult(result);
          setQuizResult(result);
          toast.success(t("quiz.player.submit_success"));
        }
      } catch (error) {
        console.error(error);
        toast.error(t("quiz.player.submit_error"));
      } finally {
        setIsSubmittingLocal(false);
        setIsSubmitting(false);
      }
    }
  }, [
    currentSection,
    currentSectionIndex,
    sections,
    expiredSections,
    getFormValues,
    quizId,
    isFavoritesQuiz,
    clearSavedState,
    saveResult,
    calculateTimeTaken,
    setExpiredSections,
    setCurrentSectionIndex,
    setCurrentQuestionIndex,
    setQuizResult,
    setIsSubmitting,
    t,
  ]);

  // Handle timer expired
  useEffect(() => {
    if (timerExpired) {
      setTimerExpired(false);
      handleSectionTimeUp();
    }
  }, [timerExpired, handleSectionTimeUp]);

  return {
    timeLeft,
    timerExpired,
    isSubmitting,
  };
}
