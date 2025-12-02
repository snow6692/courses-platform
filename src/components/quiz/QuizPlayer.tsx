"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

interface QuizPlayerProps {
  quiz: QuizForStudent;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const sections = quiz.sections ?? [];
  const currentSection = sections[currentSectionIndex];

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

  const handleSectionComplete = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      toast.info("Time's up! Moving to the next section.");
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      toast.info("Time's up! Submitting quiz.");
      handleSubmit(form.getValues());
    }
  }, [currentSectionIndex, sections.length, form]);

  const handleNextSection = () => {
    const values = form.getValues();

    // Validate current section questions are answered
    const currentQuestions = currentSection?.questions || [];
    const unansweredQuestions = currentQuestions.filter(
      (q) => !values.answers[q.id],
    );

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
    // TODO: Implement submission logic
    // const result = await submitQuiz(quiz.id, values.answers);
    // if (result.success) {
    //   router.push(`/courses/${quiz.courseId}/quiz/${quiz.id}/result`);
    // }
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Quiz submitted! (Mock)");
    }, 1000);
  };

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
    <div className="mx-auto max-w-4xl space-y-8 p-6">
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
          {currentSection.questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
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

                <FormField
                  control={form.control}
                  name={`answers.${question.id}`}
                  render={({ field }) => (
                    <FormItem className="pl-12">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
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
                              <Label
                                htmlFor={answer.id}
                                className="cursor-pointer text-base font-normal"
                              >
                                {answer.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}

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
