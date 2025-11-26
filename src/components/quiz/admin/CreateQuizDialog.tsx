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
import { createQuizSchema, CreateQuizSchema } from "@/validation/quiz.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { createQuiz } from "@/actions/quiz/quiz.action";

type IProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizType: "COURSE" | "CHAPTER" | "LESSON";
  courseId?: string | null;
  chapterId?: string | null;
  lessonId?: string | null;
};

export default function CreateQuizDialog({
  open,
  onOpenChange,
  courseId = null,
  chapterId = null,
  lessonId = null,
  quizType,
}: IProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateQuizSchema>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      timeLimit: 0,
      courseId,
      chapterId,
      lessonId,
      type: quizType,
    },
  });

  const onSubmit = (values: CreateQuizSchema) => {
    startTransition(async () => {
      const { status, message } = await createQuiz(values);
      if (status === "success") {
        toast.success(message);
        form.reset();
        onOpenChange(false);
      } else {
        toast.error(message);
      }
    });
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Add a new quiz to{" "}
            {courseId ? "course" : chapterId ? "chapter" : "lesson"}
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
                      placeholder="Short description about this quiz..."
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
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? null : Number(e.target.value);
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full"
              >
                {isPending ? "Creating Quiz..." : "Create Quiz"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
