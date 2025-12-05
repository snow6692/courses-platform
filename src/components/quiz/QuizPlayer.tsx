"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Timer } from "lucide-react";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
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

interface QuizPlayerProps {
  quiz: QuizForStudent;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [showMeme, setShowMeme] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const router = useRouter();

  const sections = quiz.sections ?? [];
  const currentSection = sections[currentSectionIndex];

  // Calculate time threshold per question (e.g., Section Time / Question Count)
  const timePerQuestion = currentSection?.timeLimit
    ? currentSection.timeLimit / (currentSection.questions.length || 1)
    : 60; // Default 60s if no limit

  const form = useForm<QuizPlayerSchemaType>({
    resolver: zodResolver(quizPlayerSchema),
    defaultValues: {
      answers: {},
    },
  });

  // Initialize timer when section changes
  useEffect(() => {
    if (currentSection?.timeLimit) {
      setTimeLeft(currentSection.timeLimit);
    } else {
      setTimeLeft(null);
    }
  }, [currentSectionIndex, currentSection]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSectionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Meme Timer Logic: Track time spent on current section/questions
  useEffect(() => {
    const memeTimer = setInterval(() => {
      if (currentSection?.timeLimit && timeLeft !== null) {
        const timeElapsed = currentSection.timeLimit - timeLeft;
        const answers = form.getValues().answers;
        const answeredCount = currentSection.questions.filter((q) => {
          const ans = answers[q.id];
          return Array.isArray(ans) ? ans.length > 0 : !!ans;
        }).length;

        // If time elapsed is significantly more than expected for the number of answered questions
        if (timeElapsed > (answeredCount + 1) * timePerQuestion + 10) {
          // +10s buffer
          const tooSlowMeme = quiz.memes.find((m) => m.trigger === "TOO_SLOW");
          if (tooSlowMeme && !showMeme) {
            setMemeUrl(useConstructUrl(tooSlowMeme.fileKey));
            setShowMeme(true);
            setTimeout(() => setShowMeme(false), 3000);
          }
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(memeTimer);
  }, [timeLeft, currentSection, form, showMeme, quiz.memes, timePerQuestion]);

  const handleSectionComplete = useCallback(async () => {
    if (currentSectionIndex < sections.length - 1) {
      toast.info("Time's up! Moving to the next section.");
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.info("Time's up! Submitting quiz.");
      await handleSubmit(form.getValues());
    }
  }, [currentSectionIndex, sections.length, form]);

  const handleNextSection = () => {
    const values = form.getValues();

    // Validate current section questions are answered
    const currentQuestions = currentSection?.questions || [];
    const unansweredQuestions = currentQuestions.filter((q) => {
      const ans = values.answers[q.id];
      return !ans || (Array.isArray(ans) && ans.length === 0);
    });

    if (unansweredQuestions.length > 0) {
      toast.error(
        `Please answer all questions before proceeding (${unansweredQuestions.length} remaining)`,
      );
      return;
    }

    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit(values);
    }
  };

  const handleSubmit = async (values: QuizPlayerSchemaType) => {
    setIsSubmitting(true);
    try {
      const result = await submitQuiz(quiz.id, values.answers);
      if (result.success) {
        setQuizResult(result);
        toast.success("Quiz submitted successfully!");
      } else {
        toast.error("Failed to submit quiz.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quizResult) {
    return (
      <QuizResult
        result={quizResult}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!currentSection) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p className="text-muted-foreground">Thank you for taking the quiz.</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative mx-auto max-w-4xl space-y-8 p-6">
      {showMeme && memeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <img
            src={memeUrl}
            alt="Meme"
            className="animate-in zoom-in max-w-md rounded-lg shadow-2xl duration-300"
          />
        </div>
      )}

      <div className="bg-background/95 sticky top-0 z-10 flex items-center justify-between border-b py-4 backdrop-blur">
        <div>
          <h2 className="text-xl font-bold">{currentSection.title}</h2>
          <p className="text-muted-foreground text-sm">
            Section {currentSectionIndex + 1} of {sections.length}
          </p>
        </div>
        {timeLeft !== null && (
          <div
            className={`flex items-center gap-2 font-mono text-xl font-bold ${
              timeLeft < 60 ? "text-destructive" : "text-primary"
            }`}
          >
            <Timer className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
          {currentSection.questions.map((question, index) => {
            const isMultipleChoice =
              question.answers.filter((a) => a.isCorrect).length > 1;

            return (
              <Card key={question.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-4">
                      <span className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <RenderDescription json={question.text} />
                        {question.imageKey && (
                          <img
                            src={useConstructUrl(question.imageKey)}
                            alt="Question Image"
                            className="mt-2 h-auto max-w-full rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                    <ToggleFavoriteButton
                      questionId={question.id}
                      isFavorited={question.favoriteQuestions?.length > 0}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`answers.${question.id}`}
                    render={({ field }) => (
                      <FormItem className="pl-12">
                        <FormControl>
                          {isMultipleChoice ? (
                            <div className="space-y-3">
                              {question.answers.map((answer) => (
                                <div
                                  key={answer.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={answer.id}
                                    checked={
                                      Array.isArray(field.value) &&
                                      field.value.includes(answer.id)
                                    }
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
                                  />
                                  <div className="flex flex-col gap-2">
                                    {answer.imageKey && (
                                      <img
                                        src={useConstructUrl(answer.imageKey)}
                                        alt="Answer Image"
                                        className="h-20 w-20 rounded-md object-cover"
                                      />
                                    )}
                                    <Label
                                      htmlFor={answer.id}
                                      className="cursor-pointer text-base font-normal"
                                    >
                                      {answer.text}
                                    </Label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value as string}
                              className="space-y-3"
                            >
                              {question.answers.map((answer) => (
                                <div
                                  key={answer.id}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={answer.id}
                                    id={answer.id}
                                  />
                                  <div className="flex flex-col gap-2">
                                    {answer.imageKey && (
                                      <img
                                        src={useConstructUrl(answer.imageKey)}
                                        alt="Answer Image"
                                        className="h-20 w-20 rounded-md object-cover"
                                      />
                                    )}
                                    <Label
                                      htmlFor={answer.id}
                                      className="cursor-pointer text-base font-normal"
                                    >
                                      {answer.text}
                                    </Label>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            );
          })}

          <div className="flex justify-end pt-8">
            <Button
              type="button"
              onClick={handleNextSection}
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {currentSectionIndex < sections.length - 1
                ? "Next Section"
                : "Submit Quiz"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
