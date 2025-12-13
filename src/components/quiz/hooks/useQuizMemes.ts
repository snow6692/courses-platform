"use client";

import { useState, useEffect } from "react";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { QuizSettings } from "../QuizSettingsModal";

interface MemeData {
  meme: {
    id: string;
    fileKey: string;
    type: "IMAGE" | "GIF" | "VIDEO";
    trigger: string;
  };
}

interface UseQuizMemesProps {
  quizStarted: boolean;
  quizSettings: QuizSettings | null;
  memes: MemeData[];
  currentSectionId: string | undefined;
  currentSectionIndex: number;
  sectionsCount: number;
  currentQuestionId: string | undefined;
  timeLeft: number | null;
  sectionTimeLimit: number | null;
}

interface UseQuizMemesReturn {
  showMeme: boolean;
  memeUrl: string | null;
  memeType: "IMAGE" | "GIF" | "VIDEO" | null;
  closeMeme: () => void;
  resetMemeState: () => void;
}

export function useQuizMemes({
  quizStarted,
  quizSettings,
  memes,
  currentSectionId,
  currentSectionIndex,
  sectionsCount,
  currentQuestionId,
  timeLeft,
  sectionTimeLimit,
}: UseQuizMemesProps): UseQuizMemesReturn {
  const [showMeme, setShowMeme] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [memeType, setMemeType] = useState<"IMAGE" | "GIF" | "VIDEO" | null>(
    null,
  );

  // Track which memes have been shown
  const [memeShownAt25Percent, setMemeShownAt25Percent] = useState<Set<string>>(
    new Set(),
  );
  const [sectionStartMemeShown, setSectionStartMemeShown] = useState<
    Set<string>
  >(new Set());
  const [slowQuestionMemeShown, setSlowQuestionMemeShown] = useState<
    Set<string>
  >(new Set());
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now(),
  );

  const showRandomMeme = (trigger: string = "RANDOM") => {
    if (memes.length === 0) return;

    let memeToShow = memes.find((m) => m.meme.trigger === trigger);
    if (!memeToShow && memes.length > 0) {
      memeToShow = memes[Math.floor(Math.random() * memes.length)];
    }

    if (memeToShow) {
      const url = useConstructUrl(memeToShow.meme.fileKey);
      setMemeUrl(url);
      setMemeType(memeToShow.meme.type as "IMAGE" | "GIF" | "VIDEO");
      setShowMeme(true);
    }
  };

  // Show meme at 25% time remaining (WITH TIMER mode)
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentSectionId) return;
    if (memes.length === 0) return;
    if (!quizSettings.enableTimer || timeLeft === null) return;
    if (!sectionTimeLimit) return;

    const twentyFivePercent = Math.floor(sectionTimeLimit * 0.25);
    const alreadyShown = memeShownAt25Percent.has(currentSectionId);

    if (timeLeft <= twentyFivePercent && timeLeft > 0 && !alreadyShown) {
      showRandomMeme("TOO_SLOW");
      setMemeShownAt25Percent((prev) => new Set([...prev, currentSectionId]));
    }
  }, [
    quizStarted,
    currentSectionId,
    quizSettings?.enableMemes,
    quizSettings?.enableTimer,
    memes,
    timeLeft,
    sectionTimeLimit,
    memeShownAt25Percent,
  ]);

  // Show meme at start of some sections
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentSectionId) return;
    if (memes.length === 0) return;
    if (sectionStartMemeShown.has(currentSectionId)) return;

    const shouldShowAtStart =
      currentSectionIndex > 0 &&
      (currentSectionIndex % 2 === 0 || sectionsCount <= 3);

    if (!shouldShowAtStart) return;

    const timer = setTimeout(() => {
      showRandomMeme("RANDOM");
      setSectionStartMemeShown((prev) => new Set([...prev, currentSectionId]));
    }, 500);

    return () => clearTimeout(timer);
  }, [
    quizStarted,
    currentSectionId,
    currentSectionIndex,
    sectionsCount,
    quizSettings?.enableMemes,
    memes,
    sectionStartMemeShown,
  ]);

  // Reset question timer when question changes
  useEffect(() => {
    if (currentQuestionId) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionId]);

  // Show meme when user spends too long on a question (NO TIMER mode)
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentQuestionId)
      return;
    if (memes.length === 0) return;
    if (quizSettings?.enableTimer) return;
    if (slowQuestionMemeShown.has(currentQuestionId)) return;

    const checkInterval = setInterval(() => {
      const timeSpent = (Date.now() - questionStartTime) / 1000;

      if (timeSpent > 45) {
        showRandomMeme("TOO_SLOW");
        setSlowQuestionMemeShown(
          (prev) => new Set([...prev, currentQuestionId]),
        );
        clearInterval(checkInterval);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [
    quizStarted,
    currentQuestionId,
    quizSettings?.enableMemes,
    quizSettings?.enableTimer,
    memes,
    questionStartTime,
    slowQuestionMemeShown,
  ]);

  const closeMeme = () => setShowMeme(false);

  const resetMemeState = () => {
    setMemeShownAt25Percent(new Set());
    setSectionStartMemeShown(new Set());
    setSlowQuestionMemeShown(new Set());
  };

  return {
    showMeme,
    memeUrl,
    memeType,
    closeMeme,
    resetMemeState,
  };
}
