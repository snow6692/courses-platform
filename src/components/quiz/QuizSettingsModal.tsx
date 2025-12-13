"use client";

import { useState } from "react";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings, Timer, Smile, ArrowLeft, Clock } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

interface QuizSettingsModalProps {
  quiz: QuizForStudent;
  onStart: (settings: QuizSettings) => void;
}

export interface QuizSettings {
  enableTimer: boolean;
  enableMemes: boolean;
  customTimerMinutes?: number; // Custom timer for favorites quiz
}

export default function QuizSettingsModal({
  quiz,
  onStart,
}: QuizSettingsModalProps) {
  const [enableTimer, setEnableTimer] = useState(true);
  const [enableMemes, setEnableMemes] = useState(true);
  const [customTimerMinutes, setCustomTimerMinutes] = useState<number>(10);
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const sections = quiz.sections ?? [];
  const totalQuestions = sections.reduce(
    (acc, section) => acc + section.questions.length,
    0,
  );

  // Check if this is a favorites quiz (no default timer on sections)
  const isFavoritesQuiz = quiz.id === "favorites-quiz";
  const hasDefaultTimer = sections.some((s) => s.timeLimit && s.timeLimit > 0);

  const handleStart = () => {
    onStart({
      enableTimer,
      enableMemes,
      customTimerMinutes:
        isFavoritesQuiz && enableTimer ? customTimerMinutes : undefined,
    });
  };

  const handleTimerMinutesChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 180) {
      setCustomTimerMinutes(num);
    } else if (value === "") {
      setCustomTimerMinutes(1);
    }
  };

  const translations = {
    ar: {
      title: "اعدادات الأختبار",
      subtitle: "قم بتجهيز بيئة الاختبار المناسبة",
      enableTimer: "تفعيل المؤقت",
      timerDescription: "توقيت لكل سؤال",
      customTimerLabel: "حدد الوقت (بالدقائق)",
      customTimerPlaceholder: "10",
      customTimerHint: "من 1 إلى 180 دقيقة",
      enableMemes: "تفعيل الميمز",
      memesDescription: "تفاعلات طريفة أثناء الحل",
      sectionsOverview: "نظرة عامة على الأقسام",
      questions: "أسئلة",
      startNow: "ابدأ الاختبار الان",
      totalQuestions: "إجمالي الأسئلة",
    },
    en: {
      title: "Quiz Settings",
      subtitle: "Prepare your quiz environment",
      enableTimer: "Enable Timer",
      timerDescription: "Timing for each question",
      customTimerLabel: "Set Time (in minutes)",
      customTimerPlaceholder: "10",
      customTimerHint: "From 1 to 180 minutes",
      enableMemes: "Enable Memes",
      memesDescription: "Fun interactions during solving",
      sectionsOverview: "Sections Overview",
      questions: "questions",
      startNow: "Start Quiz Now",
      totalQuestions: "Total Questions",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="animate-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl duration-300 dark:bg-gray-900"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-center text-white">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Settings className="h-6 w-6" />
          </div>
          <h2 className="mb-1 text-2xl font-bold">{t.title}</h2>
          <p className="text-sm text-white/80">{t.subtitle}</p>
        </div>

        {/* Content */}
        <div className="space-y-5 p-6">
          {/* Timer Toggle */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <Timer className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t.enableTimer}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.timerDescription}
                  </p>
                </div>
              </div>
              <Switch
                checked={enableTimer}
                onCheckedChange={setEnableTimer}
                className="data-[state=checked]:bg-red-600"
              />
            </div>

            {/* Custom Timer Input for Favorites Quiz */}
            {isFavoritesQuiz && enableTimer && (
              <div className="mt-4 flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <Clock className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.customTimerLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={180}
                      value={customTimerMinutes}
                      onChange={(e) => handleTimerMinutesChange(e.target.value)}
                      className="w-24"
                      placeholder={t.customTimerPlaceholder}
                    />
                    <span className="text-xs text-gray-500">
                      {t.customTimerHint}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Memes Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Smile className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t.enableMemes}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.memesDescription}
                </p>
              </div>
            </div>
            <Switch
              checked={enableMemes}
              onCheckedChange={setEnableMemes}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Sections Overview */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <h3 className="mb-3 text-end font-semibold text-gray-900 dark:text-white">
              {t.sectionsOverview}
            </h3>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between py-2"
                >
                  <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {section.questions.length} {t.questions}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {isRTL
                      ? `القسم ${index + 1} : ${section.title}`
                      : `Section ${index + 1}: ${section.title}`}
                  </span>
                </div>
              ))}
              {isFavoritesQuiz && (
                <div className="mt-2 border-t border-yellow-200 pt-2 dark:border-yellow-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.totalQuestions}: {totalQuestions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleStart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-6 text-lg font-semibold text-white transition-all duration-300 hover:from-red-700 hover:to-red-600 hover:shadow-lg"
          >
            {t.startNow}
            <ArrowLeft className={`h-5 w-5 ${isRTL ? "" : "rotate-180"}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
