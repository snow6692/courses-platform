"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizSettings } from "../QuizSettingsModal";
import {
  getQuizStorageKey,
  getQuizResultKey,
  StoredQuizState,
} from "./quiz-types";
import { UseFormReturn } from "react-hook-form";

interface Section {
  id: string;
  timeLimit: number | null;
  questions: { id: string; answers: { isCorrect: boolean }[] }[];
}

interface UseQuizStorageProps {
  quizId: string;
  sections: Section[];
  form: UseFormReturn<any>;
}

interface UseQuizStorageReturn {
  isInitialized: boolean;
  quizStarted: boolean;
  quizSettings: QuizSettings | null;
  quizResult: any;
  sectionTimers: Record<string, number>;
  expiredSections: string[];
  startTime: number | null;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  setQuizStarted: (value: boolean) => void;
  setQuizSettings: (value: QuizSettings | null) => void;
  setQuizResult: (value: any) => void;
  setSectionTimers: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  setExpiredSections: React.Dispatch<React.SetStateAction<string[]>>;
  setStartTime: (value: number | null) => void;
  setCurrentSectionIndex: (value: number) => void;
  setCurrentQuestionIndex: (value: number) => void;
  handleQuizStart: (settings: QuizSettings) => void;
  clearSavedState: () => void;
  saveResult: (result: any) => void;
  clearAllState: () => void;
  calculateTimeTaken: () => number;
}

export function useQuizStorage({
  quizId,
  sections,
  form,
}: UseQuizStorageProps): UseQuizStorageReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [sectionTimers, setSectionTimers] = useState<Record<string, number>>(
    {},
  );
  const [expiredSections, setExpiredSections] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const storageKey = getQuizStorageKey(quizId);

  // Calculate time taken in seconds
  const calculateTimeTaken = useCallback(() => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  // Load saved state
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedResult = localStorage.getItem(getQuizResultKey(quizId));
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        setQuizResult(parsedResult);
        setQuizStarted(true);
        setIsInitialized(true);
        return;
      }

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state: StoredQuizState = JSON.parse(saved);
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - state.timestamp < maxAge) {
          setQuizSettings(state.quizSettings);
          setCurrentSectionIndex(state.currentSectionIndex);
          setCurrentQuestionIndex(state.currentQuestionIndex || 0);
          setSectionTimers(state.sectionTimers);
          setExpiredSections(state.expiredSections || []);
          setStartTime(state.startTime || Date.now());
          form.reset({ answers: state.answers });
          setQuizStarted(true);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Failed to load quiz state:", error);
      localStorage.removeItem(storageKey);
    }
    setIsInitialized(true);
  }, [storageKey, form, quizId]);

  const formValues = form.watch();

  // Save state
  useEffect(() => {
    if (!isInitialized || !quizStarted || !quizSettings || !startTime) return;
    const state: StoredQuizState = {
      quizSettings,
      currentSectionIndex,
      currentQuestionIndex,
      sectionTimers,
      expiredSections,
      answers: formValues.answers || {},
      startTime,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save quiz state:", error);
    }
  }, [
    isInitialized,
    quizStarted,
    quizSettings,
    currentSectionIndex,
    currentQuestionIndex,
    sectionTimers,
    expiredSections,
    formValues,
    storageKey,
    startTime,
  ]);

  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Failed to clear quiz state:", error);
    }
  }, [storageKey]);

  const saveResult = useCallback(
    (result: any) => {
      try {
        localStorage.setItem(getQuizResultKey(quizId), JSON.stringify(result));
      } catch (error) {
        console.error("Failed to save quiz result:", error);
      }
    },
    [quizId],
  );

  const clearAllState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(getQuizResultKey(quizId));
    } catch (error) {
      console.error("Failed to clear state:", error);
    }
  }, [storageKey, quizId]);

  const initializeSectionTimers = useCallback(
    (settings: QuizSettings) => {
      if (!settings.enableTimer) return {};
      const timers: Record<string, number> = {};

      const customTimerSeconds = settings.customTimerMinutes
        ? settings.customTimerMinutes * 60
        : null;

      sections.forEach((section) => {
        if (customTimerSeconds) {
          timers[section.id] = customTimerSeconds;
        } else if (section.timeLimit) {
          timers[section.id] = section.timeLimit;
        }
      });
      return timers;
    },
    [sections],
  );

  const handleQuizStart = useCallback(
    (settings: QuizSettings) => {
      const timers = initializeSectionTimers(settings);
      setSectionTimers(timers);
      setQuizSettings(settings);
      setQuizStarted(true);
      setExpiredSections([]);
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());

      // Pre-initialize all question answers
      const initialAnswers: Record<string, string | string[]> = {};
      sections.forEach((section) => {
        section.questions.forEach((question) => {
          const isMultipleChoice =
            question.answers.filter((a) => a.isCorrect).length > 1;
          initialAnswers[question.id] = isMultipleChoice ? [] : "";
        });
      });
      form.reset({ answers: initialAnswers });
    },
    [initializeSectionTimers, sections, form],
  );

  return {
    isInitialized,
    quizStarted,
    quizSettings,
    quizResult,
    sectionTimers,
    expiredSections,
    startTime,
    currentSectionIndex,
    currentQuestionIndex,
    setQuizStarted,
    setQuizSettings,
    setQuizResult,
    setSectionTimers,
    setExpiredSections,
    setStartTime,
    setCurrentSectionIndex,
    setCurrentQuestionIndex,
    handleQuizStart,
    clearSavedState,
    saveResult,
    clearAllState,
    calculateTimeTaken,
  };
}
