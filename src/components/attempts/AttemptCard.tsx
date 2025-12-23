"use client";

import { QuizAttemptWithQuiz } from "@/app/data/quiz/get-user-quiz-attempts";
import { useLanguage } from "@/providers/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { BookOpen, Clock, Trophy, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface AttemptCardProps {
  attempt: QuizAttemptWithQuiz;
}

export function AttemptCard({ attempt }: AttemptCardProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;

  const percentageScore = attempt.score ?? 0;
  const isPassing = percentageScore >= 60;

  // Determine quiz type label and where it belongs to
  const getQuizContext = () => {
    if (attempt.quiz.type === "COURSE" && attempt.quiz.course) {
      return {
        type: t("attempts.course_quiz"),
        parent: attempt.quiz.course.title,
        slug: attempt.quiz.course.slug,
      };
    }
    if (attempt.quiz.type === "CHAPTER" && attempt.quiz.chapter) {
      return {
        type: t("attempts.chapter_quiz"),
        parent: attempt.quiz.chapter.title,
        slug: attempt.quiz.course?.slug,
      };
    }
    if (attempt.quiz.type === "LESSON" && attempt.quiz.lesson) {
      return {
        type: t("attempts.lesson_quiz"),
        parent: attempt.quiz.lesson.title,
        slug: attempt.quiz.course?.slug,
      };
    }
    return {
      type: t("attempts.quiz"),
      parent: attempt.quiz.title,
      slug: null,
    };
  };

  const context = getQuizContext();

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Score Badge - Top right */}
      <div
        className={`absolute top-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ltr:right-3 rtl:left-3 ${
          isPassing ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isPassing ? (
          <CheckCircle2 className="size-3" />
        ) : (
          <XCircle className="size-3" />
        )}
        {percentageScore.toFixed(0)}%
      </div>

      <div className="p-4">
        {/* Quiz Title */}
        <h3 className="mb-2 line-clamp-1 pe-12 text-base font-semibold">
          {attempt.quiz.title}
        </h3>

        {/* Quiz Type Badge */}
        <span className="mb-3 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
          {context.type}
        </span>

        {/* Parent Info */}
        <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
          <BookOpen className="size-4 shrink-0" />
          <span className="line-clamp-1">{context.parent}</span>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
            <Trophy className="size-4 text-amber-500" />
            <div>
              <p className="text-muted-foreground text-xs">
                {t("attempts.correct")}
              </p>
              <p className="text-sm font-semibold">
                {attempt.correctAnswers}/{attempt.totalQuestions}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
            <Clock className="size-4 text-blue-500" />
            <div>
              <p className="text-muted-foreground text-xs">
                {t("attempts.date")}
              </p>
              <p className="text-xs font-medium">
                {formatDistanceToNow(new Date(attempt.createdAt), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {context.slug && (
          <Link
            href={`/dashboard/${context.slug}/quiz/${attempt.quiz.id}`}
            className="block w-full rounded-lg bg-linear-to-r from-purple-500 to-indigo-500 py-2 text-center text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-indigo-600"
          >
            {t("attempts.retake_quiz")}
          </Link>
        )}
      </div>
    </div>
  );
}

export function AttemptCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="p-4">
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-5 w-20 animate-pulse rounded-full bg-gray-200" />
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="h-9 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
