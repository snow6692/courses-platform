"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Trophy,
  RefreshCw,
} from "lucide-react";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { ToggleFavoriteButton } from "./ToggleFavoriteButton";
import { useLanguage } from "@/providers/LanguageContext";

interface QuizResultProps {
  result: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeTaken?: number;
    questions: {
      questionId: string;
      text: string;
      imageKey: string | null;
      explanation: string | null;
      explanationImageKey: string | null;
      explanationVideoKey: string | null;
      selectedAnswerIds: string[];
      correctAnswerIds: string[];
      isCorrect: boolean;
      isFavorited: boolean;
      answers: {
        id: string;
        text: string;
        imageKey: string | null;
        isCorrect: boolean;
      }[];
    }[];
  };
  onRetry?: () => void;
}

export default function QuizResult({ result, onRetry }: QuizResultProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const { t, dir } = useLanguage();

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const isPassed = result.score >= 50;
  const scorePercentage = Math.round(result.score);

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen py-8"
      dir={dir}
      style={{ backgroundColor: "#FCF7F7" }}
    >
      <div className="mx-auto max-w-4xl px-4">
        {/* Result Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">{isPassed ? "🎉" : "😔"}</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {isPassed
              ? t("quiz.result.passed_title")
              : t("quiz.result.failed_title")}
          </h1>
          <p className="text-gray-500">
            {isPassed
              ? t("quiz.result.passed_message")
              : t("quiz.result.failed_message")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <Card className="bg-white p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {result.timeTaken ? formatTime(result.timeTaken) : "--"}
            </p>
            <p className="text-sm text-gray-500">
              {t("quiz.result.time_taken")}
            </p>
          </Card>

          <Card className="bg-white p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Target className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {scorePercentage}%
            </p>
            <p className="text-sm text-gray-500">
              {t("quiz.result.percentage")}
            </p>
          </Card>

          <Card className="bg-white p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trophy className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
            <p className="text-sm text-gray-500">
              {t("quiz.result.correct_answers")}
            </p>
          </Card>
        </div>

        {/* Review Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">
            {t("quiz.result.review_answers")}
          </h2>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {result.questions.map((q, index) => {
            const isExpanded = expandedQuestions.has(q.questionId);
            const selectedAnswer = q.answers.find((a) =>
              q.selectedAnswerIds.includes(a.id),
            );
            const correctAnswer = q.answers.find((a) => a.isCorrect);

            // Parse question text if it's JSON
            let questionText = q.text;
            try {
              if (typeof q.text === "string" && q.text.startsWith("{")) {
                const parsed = JSON.parse(q.text);
                questionText =
                  parsed?.content?.[0]?.content?.[0]?.text || q.text;
              }
            } catch {
              questionText = q.text;
            }

            return (
              <Card
                key={q.questionId}
                className="overflow-hidden bg-white"
                style={{ backgroundColor: "#FDFDFD" }}
              >
                {/* Question Header - Clickable */}
                <button
                  onClick={() => toggleQuestion(q.questionId)}
                  className={`flex w-full items-center justify-between p-4 ${dir === "rtl" ? "text-right" : "text-left"} transition-colors hover:bg-gray-50`}
                >
                  <div className="flex flex-1 items-center gap-3">
                    {/* Question Number */}
                    <span className="font-medium text-gray-400">
                      {t("quiz.player.question")} {index + 1}
                    </span>

                    {/* Chevron */}
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Question Text */}
                    <span className="line-clamp-1 font-medium text-gray-900">
                      {questionText}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${
                        q.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {q.isCorrect
                        ? t("quiz.result.correct_badge")
                        : t("quiz.result.wrong_badge")}
                    </span>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="space-y-4 border-t px-4 py-4">
                    {/* Your Answer */}
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-500">
                        {t("quiz.result.your_answer")}:
                      </span>
                      <span
                        className={`text-sm font-medium ${q.isCorrect ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedAnswer?.text || t("quiz.result.no_answer")}
                      </span>
                    </div>

                    {/* Correct Answer (if wrong) */}
                    {!q.isCorrect && correctAnswer && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-gray-500">
                          {t("quiz.result.correct_answer")}:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {correctAnswer.text}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    {(q.explanation ||
                      q.explanationImageKey ||
                      q.explanationVideoKey) && (
                      <div className="mt-4 border-t pt-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700">
                            {t("quiz.result.explanation")}
                          </span>
                        </div>

                        {q.explanation && (
                          <div className="text-sm text-gray-600">
                            <RenderDescription json={q.explanation} />
                          </div>
                        )}

                        {q.explanationImageKey && (
                          <img
                            src={useConstructUrl(q.explanationImageKey)}
                            alt="Explanation"
                            className="mt-3 max-h-48 rounded-lg"
                          />
                        )}

                        {q.explanationVideoKey && (
                          <video
                            controls
                            className="mt-3 max-h-48 w-full rounded-lg"
                            src={useConstructUrl(q.explanationVideoKey)}
                          />
                        )}
                      </div>
                    )}

                    {/* Favorite Button */}
                    <div
                      className={`flex ${dir === "rtl" ? "justify-start" : "justify-end"} pt-2`}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t("quiz.player.add_to_favorites")}</span>
                        <ToggleFavoriteButton
                          questionId={q.questionId}
                          isFavorited={q.isFavorited}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4 border-t pt-6">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3"
            >
              <RefreshCw className="h-4 w-4" />
              {t("quiz.result.retry")}
            </Button>
          )}
          <Button
            className="bg-red-600 px-6 py-3 text-white hover:bg-red-700"
            onClick={() => window.history.back()}
          >
            {t("quiz.result.finish")}
          </Button>
        </div>
      </div>
    </div>
  );
}
