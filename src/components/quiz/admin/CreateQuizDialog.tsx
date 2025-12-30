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
import { useLanguage } from "@/providers/LanguageContext";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  existingQuiz?: Partial<AdminGetQuizOfCourse>;
  quizType: "COURSE" | "LESSON" | "CHAPTER";
};

export default function QuizDialog({
  open,
  onOpenChange,
  courseId,
  chapterId,
  lessonId,
  existingQuiz,
  quizType,
}: Props) {
  const { t } = useLanguage();
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
            {existingQuiz
              ? t("admin.quiz_form.update_title")
              : t("admin.quiz_form.create_title")}
          </DialogTitle>
          <DialogDescription>
            {existingQuiz
              ? t("admin.quiz_form.update_desc")
              : t("admin.quiz_form.create_desc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.quiz_form.quiz_title_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("admin.quiz_form.quiz_title_placeholder")}
                      {...field}
                    />
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
                  <FormLabel>
                    {t("admin.quiz_form.description_label")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("admin.quiz_form.description_placeholder")}
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
                  <FormLabel>{t("admin.quiz_form.time_limit_label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("admin.quiz_form.time_limit_placeholder")}
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
                  ? t("admin.quiz_form.saving")
                  : existingQuiz
                    ? t("admin.quiz_form.update_title")
                    : t("admin.quiz_form.create_title")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
