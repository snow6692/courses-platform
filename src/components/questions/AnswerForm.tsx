"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { createAnswerSchema, createAnswerType } from "@/validation/answer.zod";
import { createAnswer, updateAnswer } from "@/actions/quiz/answer.action";
import { useRouter } from "next/navigation";
import Uploader from "../file-uploader/Uploader";
import { useLanguage } from "@/providers/LanguageContext";

export default function AnswerForm({
  questionId,
  courseId,
  answer,
  onSuccess,
}: {
  questionId: string;
  courseId: string;
  answer?: {
    id: string;
    text: string;
    isCorrect: boolean;
    imageKey?: string | null;
  };
  onSuccess?: () => void;
}) {
  const { t } = useLanguage();
  const form = useForm<createAnswerType>({
    resolver: zodResolver(createAnswerSchema),
    defaultValues: answer
      ? {
          questionId,
          text: answer.text,
          isCorrect: answer.isCorrect,
          imageKey: answer.imageKey ?? "",
        }
      : {
          questionId,
          text: "",
          isCorrect: false,
          imageKey: "",
        },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (values: createAnswerType) => {
    startTransition(async () => {
      if (answer) {
        // Update
        const { data: result, error } = await tryCatch(
          updateAnswer({ ...values, id: answer.id }, courseId),
        );

        if (error) {
          toast.error(t("admin.quiz.failed_update_answer"));
          return;
        }
        if (result.status === "success") {
          toast.success(result.message);
          form.reset();
          router.refresh();
          onSuccess?.();
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } else {
        // Create
        const { data: result, error } = await tryCatch(
          createAnswer(values, courseId),
        );

        if (error) {
          toast.error(t("admin.quiz.failed_create_answer"));
          return;
        }
        if (result.status === "success") {
          toast.success(result.message);
          form.reset();
          router.refresh();
          onSuccess?.();
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.quiz.answer_text")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("admin.quiz.answer_text")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="imageKey"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.quiz.answer_image")}</FormLabel>
              <FormControl>
                <Uploader
                  fileTypeAccepted="image"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full cursor-pointer"
          type="submit"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending
            ? answer
              ? t("admin.quiz.updating")
              : t("admin.quiz.creating")
            : answer
              ? t("admin.quiz.update")
              : t("admin.quiz.create_answer")}
        </Button>
      </form>
    </Form>
  );
}
