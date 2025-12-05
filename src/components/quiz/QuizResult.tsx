"use client";

import { Card } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { ToggleFavoriteButton } from "./ToggleFavoriteButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuizResultProps {
  result: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
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
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold">Quiz Completed!</h2>
        <div className="text-xl">
          You scored <span className="font-bold">{result.correctAnswers}</span>{" "}
          out of <span className="font-bold">{result.totalQuestions}</span> (
          {result.score.toFixed(0)}%)
        </div>
        <div className="flex justify-center gap-4">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Retry Quiz
            </Button>
          )}
          <Button asChild>
            <Link href="/dashboard/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {result.questions.map((q, index) => (
          <Card key={q.questionId} className="space-y-6 p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-4">
                <span className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <RenderDescription json={q.text} />
                  {q.imageKey && (
                    <img
                      src={useConstructUrl(q.imageKey)}
                      alt="Question Image"
                      className="mt-2 h-auto max-w-full rounded-lg"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ToggleFavoriteButton
                  questionId={q.questionId}
                  isFavorited={false}
                />
                {q.isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>

            <div className="grid gap-4 pl-12">
              {q.answers.map((answer) => {
                const isSelected = q.selectedAnswerIds.includes(answer.id);
                const isCorrect = answer.isCorrect;

                let borderClass = "border-border";
                if (isSelected && isCorrect)
                  borderClass = "border-green-500 bg-green-50/50";
                else if (isSelected && !isCorrect)
                  borderClass = "border-red-500 bg-red-50/50";
                else if (isCorrect)
                  borderClass = "border-green-500 bg-green-50/50";

                return (
                  <div
                    key={answer.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${borderClass}`}
                  >
                    {answer.imageKey && (
                      <img
                        src={useConstructUrl(answer.imageKey)}
                        alt="Answer Image"
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <span
                      className={isCorrect ? "font-medium text-green-700" : ""}
                    >
                      {answer.text}
                    </span>
                    {isCorrect && (
                      <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
                    )}
                    {isSelected && !isCorrect && (
                      <XCircle className="ml-auto h-4 w-4 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {(q.explanation ||
              q.explanationImageKey ||
              q.explanationVideoKey) && (
              <div className="border-t pt-4 pl-12">
                <div className="text-muted-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Explanation</span>
                </div>
                {q.explanation && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <RenderDescription json={q.explanation} />
                  </div>
                )}
                {q.explanationImageKey && (
                  <img
                    src={useConstructUrl(q.explanationImageKey)}
                    alt="Explanation Image"
                    className="mt-4 max-h-64 rounded-lg object-contain"
                  />
                )}
                {q.explanationVideoKey && (
                  <video
                    controls
                    className="mt-4 max-h-64 w-full rounded-lg"
                    src={useConstructUrl(q.explanationVideoKey)}
                  />
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
