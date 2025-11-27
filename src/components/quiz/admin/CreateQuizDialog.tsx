// components/quiz/admin/QuizDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { quizSchema, QuizSchema } from "@/validation/quiz.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { saveQuiz } from "@/actions/quiz/quiz.action";
import { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId?: string | null;
  chapterId?: string | null;
  lessonId?: string | null;
  existingQuiz?: AdminGetQuizOfCourse | null;
  quizType: "COURSE" | "LESSON" | "CHAPTER";
};

export default function QuizDialog({
  open,
  onOpenChange,
  courseId = null,
  chapterId = null,
  lessonId = null,
  existingQuiz = null,
  quizType,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuizSchema>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      quizId: existingQuiz?.id,
      title: existingQuiz?.title || "",
      description: existingQuiz?.description || "",
      timeLimit: existingQuiz?.timeLimit || null,
      courseId,
      chapterId,
      lessonId,
    },
  });

  const onSubmit = (values: QuizSchema) => {
    startTransition(async () => {
      const result = await saveQuiz(values, quizType);
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {existingQuiz ? "Update Quiz" : "Create Quiz"}
          </DialogTitle>
          <DialogDescription>
            {existingQuiz ? "Update your quiz details" : "Add a new quiz"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (minutes) - Optional</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending
                  ? "Saving..."
                  : existingQuiz
                    ? "Update Quiz"
                    : "Create Quiz"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
