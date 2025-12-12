"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ToggleFavoriteButton } from "./ToggleFavoriteButton";
import { useLanguage } from "@/providers/LanguageContext";
import { Control } from "react-hook-form";
import { QuizPlayerSchemaType } from "@/validation/quizPlayer.zod";

interface Answer {
  id: string;
  text: string;
  imageKey: string | null;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  imageKey: string | null;
  answers: Answer[];
  favoriteQuestions?: { id: string }[];
}

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  control: Control<QuizPlayerSchemaType>;
}

export function QuestionCard({
  question,
  questionIndex,
  control,
}: QuestionCardProps) {
  const { t, dir } = useLanguage();

  const isMultipleChoice =
    question.answers.filter((a) => a.isCorrect).length > 1;

  // Parse question text if it's JSON
  const questionText =
    typeof question.text === "string" && question.text.startsWith("{")
      ? JSON.parse(question.text)?.content?.[0]?.content?.[0]?.text ||
        question.text
      : question.text;

  return (
    <div
      className="rounded-2xl bg-white p-8 shadow-lg"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      {/* Question Header */}
      <div
        className={`mb-6 flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}
      >
        <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
          {t("quiz.player.question")} {questionIndex + 1}
        </span>
      </div>

      {/* Question Text */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {questionText}
        </h2>
        {question.imageKey && (
          <img
            src={useConstructUrl(question.imageKey)}
            alt="Question"
            className="mx-auto max-h-64 rounded-lg"
          />
        )}
      </div>

      {/* Favorite Button */}
      <div className="mb-4 flex justify-end">
        <ToggleFavoriteButton
          questionId={question.id}
          isFavorited={(question.favoriteQuestions?.length ?? 0) > 0}
        />
      </div>

      {/* Answers */}
      <FormField
        control={control}
        name={`answers.${question.id}`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              {isMultipleChoice ? (
                <div className="space-y-3">
                  {question.answers.map((answer, idx) => {
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
                  {question.answers.map((answer, idx) => {
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
                        <RadioGroupItem value={answer.id} className="h-5 w-5" />
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
    </div>
  );
}
