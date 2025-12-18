"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { QuizPlayerSkeleton } from "./QuizSkeletons";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quizPlayerSchema,
  QuizPlayerSchemaType,
} from "@/validation/quizPlayer.zod";
import {
  submitQuiz,
  submitFavoritesQuiz,
} from "@/actions/quiz/student.actions";
import QuizResult from "./QuizResult";
import QuizSettingsModal, { QuizSettings } from "./QuizSettingsModal";
import { useLanguage } from "@/providers/LanguageContext";
import { QuizHeader } from "./QuizHeader";
import { MemePanel } from "./MemePanel";
import { QuestionNavigation, SectionNavigation } from "./QuizNavigation";
import { QuestionCard } from "./QuestionCard";
import { QuizNavigationButtons } from "./QuizNavigationButtons";
import { useQuizSafe } from "@/providers/QuizContext";

interface QuizPlayerProps {
  quiz: QuizForStudent;
}

const getQuizStorageKey = (quizId: string) => `quiz_state_${quizId}`;
const getQuizResultKey = (quizId: string) => `quiz_result_${quizId}`;

interface StoredQuizState {
  quizSettings: QuizSettings;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  sectionTimers: Record<string, number>;
  expiredSections: string[];
  answers: Record<string, string | string[]>;
  startTime: number;
  timestamp: number;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sectionTimers, setSectionTimers] = useState<Record<string, number>>(
    {},
  );
  const [expiredSections, setExpiredSections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [showMeme, setShowMeme] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [memeType, setMemeType] = useState<"IMAGE" | "GIF" | "VIDEO" | null>(
    null,
  );
  const [timerExpired, setTimerExpired] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { t, dir } = useLanguage();
  const { setQuizActive } = useQuizSafe();

  // Update quiz active state when quiz starts or ends
  useEffect(() => {
    const isActive = quizStarted && !quizResult;
    setQuizActive(isActive);

    // Cleanup when component unmounts
    return () => {
      setQuizActive(false);
    };
  }, [quizStarted, quizResult, setQuizActive]);

  const sections = quiz.sections ?? [];
  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const storageKey = getQuizStorageKey(quiz.id);

  const timeLeft = currentSection
    ? (sectionTimers[currentSection.id] ?? null)
    : null;

  const form = useForm<QuizPlayerSchemaType>({
    resolver: zodResolver(quizPlayerSchema),
    defaultValues: {
      answers: {},
    },
    shouldUnregister: false, // Keep field values when switching between questions
  });

  // Calculate time taken in seconds
  const calculateTimeTaken = useCallback(() => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  // Load saved state
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // First check if there's a saved result
      const savedResult = localStorage.getItem(getQuizResultKey(quiz.id));
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        setQuizResult(parsedResult);
        setQuizStarted(true);
        setIsInitialized(true);
        return;
      }

      // Otherwise check for saved quiz state
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
  }, [storageKey, form, quiz.id]);

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
        localStorage.setItem(getQuizResultKey(quiz.id), JSON.stringify(result));
      } catch (error) {
        console.error("Failed to save quiz result:", error);
      }
    },
    [quiz.id],
  );

  const clearAllState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(getQuizResultKey(quiz.id));
    } catch (error) {
      console.error("Failed to clear state:", error);
    }
  }, [storageKey, quiz.id]);

  const initializeSectionTimers = useCallback(
    (settings: QuizSettings) => {
      if (!settings.enableTimer) return {};
      const timers: Record<string, number> = {};

      // For favorites quiz with custom timer, apply to all sections
      const customTimerSeconds = settings.customTimerMinutes
        ? settings.customTimerMinutes * 60
        : null;

      sections.forEach((section) => {
        if (customTimerSeconds) {
          // Use custom timer (for favorites quiz)
          timers[section.id] = customTimerSeconds;
        } else if (section.timeLimit) {
          // Use section's default timer
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

      // Pre-initialize all question answers to prevent form field issues
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

  // Timer logic
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableTimer || !currentSection) return;
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setSectionTimers((prev) => {
        const currentTime = prev[currentSection.id];
        if (currentTime === undefined || currentTime <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          return { ...prev, [currentSection.id]: 0 };
        }
        return { ...prev, [currentSection.id]: currentTime - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizSettings?.enableTimer, currentSection, timeLeft]);

  // Handle section time up
  const handleSectionTimeUp = useCallback(async () => {
    if (!currentSection) return;

    const newExpiredSections = [...expiredSections, currentSection.id];
    setExpiredSections(newExpiredSections);

    // Find ANY section that still has time remaining (not just ones after current)
    // First check sections after current, then sections before
    let nextSectionIndex = sections.findIndex(
      (s, idx) =>
        idx > currentSectionIndex && !newExpiredSections.includes(s.id),
    );

    // If no section found after current, check sections before current
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
      const values = form.getValues();
      const timeTaken = calculateTimeTaken();
      setIsSubmitting(true);
      try {
        let result;
        const isFavoritesQuizLocal =
          quiz.id === "favorites-quiz" || quiz.id.startsWith("folder-quiz-");
        if (isFavoritesQuizLocal) {
          // For favorites quiz, collect all question IDs from the virtual quiz
          const questionIds = sections.flatMap((s) =>
            s.questions.map((q) => q.id),
          );
          result = await submitFavoritesQuiz(
            questionIds,
            values.answers,
            timeTaken,
          );
        } else {
          result = await submitQuiz(quiz.id, values.answers, timeTaken);
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
        setIsSubmitting(false);
      }
    }
  }, [
    currentSection,
    currentSectionIndex,
    sections,
    expiredSections,
    form,
    quiz.id,
    clearSavedState,
    saveResult,
    calculateTimeTaken,
    t,
  ]);

  useEffect(() => {
    if (timerExpired) {
      setTimerExpired(false);
      handleSectionTimeUp();
    }
  }, [timerExpired, handleSectionTimeUp]);

  // Meme Logic - Show when 25% time remaining or at section start
  const [memeShownAt25Percent, setMemeShownAt25Percent] = useState<Set<string>>(
    new Set(),
  );
  const [sectionStartMemeShown, setSectionStartMemeShown] = useState<
    Set<string>
  >(new Set());

  // Show meme at 25% time remaining
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentSection) return;
    if (quiz.memes.length === 0) return;
    if (!quizSettings.enableTimer || timeLeft === null) return;

    const totalTime = currentSection.timeLimit;
    if (!totalTime) return;

    const twentyFivePercent = Math.floor(totalTime * 0.25);
    const alreadyShown = memeShownAt25Percent.has(currentSection.id);

    // Show meme when time hits 25% remaining
    if (timeLeft <= twentyFivePercent && timeLeft > 0 && !alreadyShown) {
      let memeToShow = quiz.memes.find((m) => m.meme.trigger === "TOO_SLOW");
      if (!memeToShow && quiz.memes.length > 0) {
        memeToShow = quiz.memes[Math.floor(Math.random() * quiz.memes.length)];
      }

      if (memeToShow) {
        const url = useConstructUrl(memeToShow.meme.fileKey);
        setMemeUrl(url);
        setMemeType(memeToShow.meme.type as "IMAGE" | "GIF" | "VIDEO");
        setShowMeme(true);
        setMemeShownAt25Percent(
          (prev) => new Set([...prev, currentSection.id]),
        );
      }
    }
  }, [
    quizStarted,
    currentSection?.id,
    quizSettings?.enableMemes,
    quizSettings?.enableTimer,
    quiz.memes,
    timeLeft,
    memeShownAt25Percent,
  ]);

  // Show meme at start of some sections (every 2nd or 3rd section)
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentSection) return;
    if (quiz.memes.length === 0) return;
    if (sectionStartMemeShown.has(currentSection.id)) return;

    // Only show for specific sections (not the first, and every 2-3 sections)
    const shouldShowAtStart =
      currentSectionIndex > 0 &&
      (currentSectionIndex % 2 === 0 || sections.length <= 3);

    if (!shouldShowAtStart) return;

    // Small delay to let section transition complete
    const timer = setTimeout(() => {
      let memeToShow = quiz.memes.find((m) => m.meme.trigger === "RANDOM");
      if (!memeToShow && quiz.memes.length > 0) {
        memeToShow = quiz.memes[Math.floor(Math.random() * quiz.memes.length)];
      }

      if (memeToShow) {
        const url = useConstructUrl(memeToShow.meme.fileKey);
        setMemeUrl(url);
        setMemeType(memeToShow.meme.type as "IMAGE" | "GIF" | "VIDEO");
        setShowMeme(true);
        setSectionStartMemeShown(
          (prev) => new Set([...prev, currentSection.id]),
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    quizStarted,
    currentSection?.id,
    currentSectionIndex,
    sections.length,
    quizSettings?.enableMemes,
    quiz.memes,
    sectionStartMemeShown,
  ]);

  // Show meme when user spends too long on a question (NO TIMER mode)
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now(),
  );
  const [slowQuestionMemeShown, setSlowQuestionMemeShown] = useState<
    Set<string>
  >(new Set());

  // Reset question timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion?.id]);

  // Check if user is taking too long on a question (only when timer is disabled)
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentQuestion) return;
    if (quiz.memes.length === 0) return;
    if (quizSettings?.enableTimer) return; // Only for NO TIMER mode
    if (slowQuestionMemeShown.has(currentQuestion.id)) return;

    // Check every 5 seconds if user spent more than 45 seconds on this question
    const checkInterval = setInterval(() => {
      const timeSpent = (Date.now() - questionStartTime) / 1000;

      if (timeSpent > 45) {
        let memeToShow = quiz.memes.find((m) => m.meme.trigger === "TOO_SLOW");
        if (!memeToShow && quiz.memes.length > 0) {
          memeToShow =
            quiz.memes[Math.floor(Math.random() * quiz.memes.length)];
        }

        if (memeToShow) {
          const url = useConstructUrl(memeToShow.meme.fileKey);
          setMemeUrl(url);
          setMemeType(memeToShow.meme.type as "IMAGE" | "GIF" | "VIDEO");
          setShowMeme(true);
          setSlowQuestionMemeShown(
            (prev) => new Set([...prev, currentQuestion.id]),
          );
        }
        clearInterval(checkInterval);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [
    quizStarted,
    currentQuestion?.id,
    quizSettings?.enableMemes,
    quizSettings?.enableTimer,
    quiz.memes,
    questionStartTime,
    slowQuestionMemeShown,
  ]);

  const closeMeme = () => setShowMeme(false);

  // Navigation
  const navigateToSection = useCallback(
    (sectionIndex: number) => {
      const targetSection = sections[sectionIndex];
      if (!targetSection) return;
      if (expiredSections.includes(targetSection.id)) {
        toast.error(t("quiz.player.section_expired"));
        return;
      }
      if (quizSettings?.enableTimer) {
        const sectionTime = sectionTimers[targetSection.id];
        if (sectionTime !== undefined && sectionTime <= 0) {
          toast.error(t("quiz.player.section_time_expired"));
          return;
        }
      }
      setCurrentSectionIndex(sectionIndex);
      setCurrentQuestionIndex(0);
    },
    [sections, expiredSections, quizSettings?.enableTimer, sectionTimers, t],
  );

  const navigateToQuestion = (questionIndex: number) => {
    if (
      questionIndex >= 0 &&
      questionIndex < (currentSection?.questions.length || 0)
    ) {
      setCurrentQuestionIndex(questionIndex);
    }
  };

  const goToNextQuestion = () => {
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
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const isFavoritesQuiz =
    quiz.id === "favorites-quiz" || quiz.id.startsWith("folder-quiz-");

  const handleSubmit = async () => {
    const values = form.getValues();
    const timeTaken = calculateTimeTaken();
    setIsSubmitting(true);
    try {
      let result;
      if (isFavoritesQuiz) {
        // For favorites quiz, collect all question IDs from the virtual quiz
        const questionIds = sections.flatMap((s) =>
          s.questions.map((q) => q.id),
        );
        result = await submitFavoritesQuiz(
          questionIds,
          values.answers,
          timeTaken,
        );
      } else {
        result = await submitQuiz(quiz.id, values.answers, timeTaken);
      }
      if (result.success) {
        clearSavedState();
        saveResult(result);
        setQuizResult(result);
        toast.success(t("quiz.player.submit_success"));
      } else {
        toast.error(t("quiz.player.submit_failed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("quiz.player.submit_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    clearAllState();
    setQuizResult(null);
    setQuizStarted(false);
    setQuizSettings(null);
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setSectionTimers({});
    setExpiredSections([]);
    setMemeShownAt25Percent(new Set());
    setSectionStartMemeShown(new Set());
    setStartTime(null);
    form.reset({ answers: {} });
  };

  const getSectionStatus = useCallback(
    (sectionIndex: number) => {
      const section = sections[sectionIndex];
      if (!section) return "locked";
      if (expiredSections.includes(section.id)) return "expired";
      if (quizSettings?.enableTimer) {
        const time = sectionTimers[section.id];
        if (time !== undefined && time <= 0) return "expired";
      }
      if (sectionIndex === currentSectionIndex) return "current";
      return "available";
    },
    [
      sections,
      expiredSections,
      quizSettings?.enableTimer,
      sectionTimers,
      currentSectionIndex,
    ],
  );

  const isQuestionAnswered = (questionId: string): boolean => {
    const ans = formValues.answers?.[questionId];
    return Boolean(ans && (Array.isArray(ans) ? ans.length > 0 : true));
  };

  const isSectionComplete = useCallback(
    (sectionIndex: number): boolean => {
      const section = sections[sectionIndex];
      if (!section) return false;
      return section.questions.every((q) => isQuestionAnswered(q.id));
    },
    [sections, formValues.answers],
  );

  if (!isInitialized) {
    return <QuizPlayerSkeleton />;
  }

  if (!quizStarted) {
    return <QuizSettingsModal quiz={quiz} onStart={handleQuizStart} />;
  }

  if (quizResult) {
    return <QuizResult result={quizResult} onRetry={handleRetry} />;
  }

  if (!currentSection || !currentQuestion) {
    return <QuizPlayerSkeleton />;
  }

  const isLastQuestion =
    currentQuestionIndex === currentSection.questions.length - 1 &&
    currentSectionIndex === sections.length - 1;

  return (
    <div
      className="min-h-screen"
      dir={dir}
      style={{ backgroundColor: "#FCF7F7" }}
    >
      {/* Meme Side Panel */}
      <MemePanel
        show={showMeme}
        url={memeUrl}
        type={memeType}
        onClose={closeMeme}
      />

      {/* Header */}
      <QuizHeader
        sectionTitle={currentSection.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentSection.questions.length}
        timeLeft={timeLeft}
        enableTimer={quizSettings?.enableTimer || false}
      />

      {/* Question Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Form {...form}>
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            control={form.control}
          />
        </Form>

        {/* Navigation Buttons */}
        <QuizNavigationButtons
          onNext={isLastQuestion ? handleSubmit : goToNextQuestion}
          onPrev={goToPrevQuestion}
          isLastQuestion={isLastQuestion}
          isFirstQuestion={currentQuestionIndex === 0}
          isSubmitting={isSubmitting}
        />

        {/* Question Navigation */}
        <QuestionNavigation
          questions={currentSection.questions}
          currentIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          isAnswered={isQuestionAnswered}
        />

        {/* Section Navigation */}
        <SectionNavigation
          sections={sections}
          currentIndex={currentSectionIndex}
          onNavigate={navigateToSection}
          getSectionStatus={getSectionStatus}
          isSectionComplete={isSectionComplete}
        />
      </div>
    </div>
  );
}
