"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getQuizPreviousAttempts,
  QuizPreviousAttempt,
} from "@/actions/quiz/get-previous-attempts";
import {
  History,
  ChevronDown,
  ChevronUp,
  Trophy,
  Clock,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguage } from "@/providers/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface PreviousAttemptsProps {
  quizId: string;
}

export default function PreviousAttempts({ quizId }: PreviousAttemptsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [attempts, setAttempts] = useState<QuizPreviousAttempt[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;

  const handleToggle = () => {
    if (!hasLoaded && !isOpen) {
      // Load attempts when opening for the first time
      startTransition(async () => {
        const data = await getQuizPreviousAttempts(quizId, 0);
        setAttempts(data.attempts);
        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
        setHasLoaded(true);
        setIsOpen(true);
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const data = await getQuizPreviousAttempts(quizId, attempts.length);
      setAttempts((prev) => [...prev, ...data.attempts]);
      setHasMore(data.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Don't show if no previous attempts (after loading)
  const showButton = !hasLoaded || totalCount > 0;

  if (!showButton) return null;

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={handleToggle}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2"
      >
        <History className="h-4 w-4" />
        {isPending ? (
          <span>{t("attempts.loading")}</span>
        ) : (
          <>
            {t("attempts.show_previous")}
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && attempts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <Card className="p-4">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                {t("attempts.previous_attempts")} ({totalCount})
              </h3>
              <div className="space-y-3">
                {attempts.map((attempt, index) => {
                  const isPassing = (attempt.score ?? 0) >= 60;
                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{totalCount - index}
                        </span>
                        <div className="flex items-center gap-2">
                          <Trophy
                            className={`h-4 w-4 ${isPassing ? "text-green-500" : "text-red-500"}`}
                          />
                          <span
                            className={`font-semibold ${isPassing ? "text-green-600" : "text-red-600"}`}
                          >
                            {Math.round(attempt.score ?? 0)}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.correctAnswers}/{attempt.totalQuestions}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(attempt.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="text-primary hover:text-primary/80"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("attempts.loading")}
                      </>
                    ) : (
                      t("attempts.load_more")
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {isOpen && hasLoaded && attempts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <Card className="p-4 text-center text-sm text-gray-500">
              {t("attempts.no_previous")}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
