"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quizPlayerSchema,
  QuizPlayerSchemaType,
} from "@/validation/quizPlayer.zod";
import { submitQuiz } from "@/actions/quiz/student.actions";
import QuizResult from "./QuizResult";
import { ToggleFavoriteButton } from "./ToggleFavoriteButton";
import QuizSettingsModal, { QuizSettings } from "./QuizSettingsModal";
import { useLanguage } from "@/providers/LanguageContext";
import { QuizHeader } from "./QuizHeader";
import { MemePanel } from "./MemePanel";
import { QuestionNavigation, SectionNavigation } from "./QuizNavigation";

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
  const [memeShownForSection, setMemeShownForSection] = useState<string | null>(
    null,
  );
  const [timerExpired, setTimerExpired] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { t, dir } = useLanguage();

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
  });

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
    if (!isInitialized || !quizStarted || !quizSettings) return;
    const state: StoredQuizState = {
      quizSettings,
      currentSectionIndex,
      currentQuestionIndex,
      sectionTimers,
      expiredSections,
      answers: formValues.answers || {},
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
      sections.forEach((section) => {
        if (section.timeLimit) {
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
    },
    [initializeSectionTimers],
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

    // Mark current section as expired
    const newExpiredSections = [...expiredSections, currentSection.id];
    setExpiredSections(newExpiredSections);

    // Check if there are any non-expired sections after this one
    const nextSectionIndex = sections.findIndex(
      (s, idx) =>
        idx > currentSectionIndex && !newExpiredSections.includes(s.id),
    );

    if (nextSectionIndex !== -1) {
      toast.info("انتهى الوقت! الانتقال للقسم التالي.");
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
    } else {
      // This is the last section or all sections expired - submit immediately
      toast.info("انتهى الوقت! جاري تسليم الاختبار...");
      const values = form.getValues();
      setIsSubmitting(true);
      try {
        const result = await submitQuiz(quiz.id, values.answers);
        if (result.success) {
          clearSavedState();
          saveResult(result);
          setQuizResult(result);
          toast.success("تم تسليم الاختبار بنجاح!");
        }
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء التسليم.");
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
  ]);

  useEffect(() => {
    if (timerExpired) {
      setTimerExpired(false);
      handleSectionTimeUp();
    }
  }, [timerExpired, handleSectionTimeUp]);

  // Meme Logic
  useEffect(() => {
    if (!quizStarted || !quizSettings?.enableMemes || !currentSection) return;
    if (quiz.memes.length === 0) return;
    if (memeShownForSection === currentSection.id) return;

    const delaySeconds = currentSection.timeLimit
      ? Math.floor(currentSection.timeLimit * 0.25)
      : 15;

    const memeTimeout = setTimeout(() => {
      if (memeShownForSection === currentSection.id) return;

      let memeToShow = quiz.memes.find((m) => m.meme.trigger === "TOO_SLOW");
      if (!memeToShow && quiz.memes.length > 0) {
        memeToShow = quiz.memes[Math.floor(Math.random() * quiz.memes.length)];
      }

      if (memeToShow) {
        const url = useConstructUrl(memeToShow.meme.fileKey);
        setMemeUrl(url);
        setMemeType(memeToShow.meme.type as "IMAGE" | "GIF" | "VIDEO");
        setShowMeme(true);
        setMemeShownForSection(currentSection.id);
      }
    }, delaySeconds * 1000);

    return () => clearTimeout(memeTimeout);
  }, [
    quizStarted,
    currentSection?.id,
    quizSettings?.enableMemes,
    quiz.memes,
    memeShownForSection,
  ]);

  const closeMeme = () => setShowMeme(false);

  // Navigation
  const navigateToSection = useCallback(
    (sectionIndex: number) => {
      const targetSection = sections[sectionIndex];
      if (!targetSection) return;
      if (expiredSections.includes(targetSection.id)) {
        toast.error("هذا القسم انتهى وقته.");
        return;
      }
      if (quizSettings?.enableTimer) {
        const sectionTime = sectionTimers[targetSection.id];
        if (sectionTime !== undefined && sectionTime <= 0) {
          toast.error("انتهى وقت هذا القسم.");
          return;
        }
      }
      setCurrentSectionIndex(sectionIndex);
      setCurrentQuestionIndex(0);
    },
    [sections, expiredSections, quizSettings?.enableTimer, sectionTimers],
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
      // Move to next section
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

  const handleSubmit = async () => {
    const values = form.getValues();
    setIsSubmitting(true);
    try {
      const result = await submitQuiz(quiz.id, values.answers);
      if (result.success) {
        clearSavedState();
        saveResult(result);
        setQuizResult(result);
        toast.success("تم تسليم الاختبار بنجاح!");
      } else {
        toast.error("فشل في تسليم الاختبار.");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء التسليم.");
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
    setMemeShownForSection(null);
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

  const isQuestionAnswered = (questionId: string) => {
    const ans = formValues.answers?.[questionId];
    return ans && (Array.isArray(ans) ? ans.length > 0 : true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isInitialized) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!quizStarted) {
    return <QuizSettingsModal quiz={quiz} onStart={handleQuizStart} />;
  }

  if (quizResult) {
    return <QuizResult result={quizResult} onRetry={handleRetry} />;
  }

  if (!currentSection || !currentQuestion) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isMultipleChoice =
    currentQuestion.answers.filter((a) => a.isCorrect).length > 1;
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
        <div
          className="rounded-2xl bg-white p-8 shadow-lg"
          style={{ backgroundColor: "#FDFDFD" }}
        >
          {/* Question Header */}
          <div
            className={`mb-6 flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}
          >
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
              {t("quiz.player.question")} {currentQuestionIndex + 1}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {typeof currentQuestion.text === "string" &&
              currentQuestion.text.startsWith("{")
                ? JSON.parse(currentQuestion.text)?.content?.[0]?.content?.[0]
                    ?.text || currentQuestion.text
                : currentQuestion.text}
            </h2>
            {currentQuestion.imageKey && (
              <img
                src={useConstructUrl(currentQuestion.imageKey)}
                alt="Question"
                className="mx-auto max-h-64 rounded-lg"
              />
            )}
          </div>

          {/* Favorite Button */}
          <div className="mb-4 flex justify-end">
            <ToggleFavoriteButton
              questionId={currentQuestion.id}
              isFavorited={currentQuestion.favoriteQuestions?.length > 0}
            />
          </div>

          {/* Answers */}
          <Form {...form}>
            <FormField
              control={form.control}
              name={`answers.${currentQuestion.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {isMultipleChoice ? (
                      <div className="space-y-3">
                        {currentQuestion.answers.map((answer, idx) => {
                          const letters = ["A", "B", "C", "D", "E", "F"];
                          const isChecked =
                            Array.isArray(field.value) &&
                            field.value.includes(answer.id);
                          return (
                            <label
                              key={answer.id}
                              className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                                isChecked
                                  ? "border-red-500"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              style={{ backgroundColor: "#FDFDFD" }}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const current = Array.isArray(field.value)
                                    ? field.value
                                    : [];
                                  if (checked) {
                                    field.onChange([...current, answer.id]);
                                  } else {
                                    field.onChange(
                                      current.filter(
                                        (val: string) => val !== answer.id,
                                      ),
                                    );
                                  }
                                }}
                                className="h-5 w-5"
                              />
                              <span className="flex-1 text-lg text-black">
                                {answer.text}
                              </span>
                              <span className="font-semibold text-gray-500">
                                {letters[idx]}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value as string}
                        className="space-y-3"
                      >
                        {currentQuestion.answers.map((answer, idx) => {
                          const letters = ["A", "B", "C", "D", "E", "F"];
                          const isSelected = field.value === answer.id;
                          return (
                            <label
                              key={answer.id}
                              className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                                isSelected
                                  ? "border-red-500"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              style={{ backgroundColor: "#FDFDFD" }}
                            >
                              <RadioGroupItem
                                value={answer.id}
                                className="h-5 w-5"
                              />
                              <span className="flex-1 text-lg text-black">
                                {answer.text}
                              </span>
                              <span className="font-semibold text-gray-500">
                                {letters[idx]}
                              </span>
                            </label>
                          );
                        })}
                      </RadioGroup>
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            onClick={isLastQuestion ? handleSubmit : goToNextQuestion}
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
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
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
        />
      </div>
    </div>
  );
}
