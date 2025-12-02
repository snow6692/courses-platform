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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuestion, updateQuestion } from "@/actions/quiz/question.action";
import { toast } from "sonner";
import { createQuestionSchema } from "@/validation/question.zod";
import RichTextEditor from "../rich-text-editor/Editor";
import Uploader from "../file-uploader/Uploader";
import { tryCatch } from "@/hooks/try-catch";
import { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof createQuestionSchema>;

export default function QuestionForm({
  quizId,
  courseId,
  question,
  chapterId,
  sectionId,
}: {
  quizId: string;
  courseId: string;
  question?: AdminGetQuizOfCourse["sections"][number]["questions"][number];
  chapterId?: string;
  sectionId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: question
      ? {
          sectionId,

          text: question.text ?? "",
          imageKey: question.imageKey ?? "",
          explanation: question.explanation ?? "",
          explanationImageKey: question.explanationImageKey ?? "",
          explanationVideoKey: question.explanationVideoKey ?? "",
        }
      : {
          sectionId,
          text: "",
          imageKey: "",
          explanation: "",
          explanationImageKey: "",
          explanationVideoKey: "",
        },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      //create
      if (!question) {
        const { data: result, error } = await tryCatch(
          createQuestion({ ...data }, courseId),
        );
        if (error) {
          toast.error("Failed to Create Questions, Try again later");
          return;
        }
        if (result.status === "success") {
          toast.success(result.message);
          form.reset();
          router.refresh(); // Instant UI update
          return;
        }
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
      } else {
        //update
        const { data: result, error } = await tryCatch(
          updateQuestion({ ...data }, question.id, courseId),
        );
        if (error) {
          toast.error("Failed to Update Questions, Try again later");
          return;
        }
        if (result.status === "success") {
          toast.success(result.message);
          form.reset();
          router.refresh(); // Instant UI update
          return;
        }
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
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
              <FormLabel>Question Image (optional)</FormLabel>
              <FormControl>
                <Uploader
                  fileTypeAccepted="image"
                  onChange={field.onChange}
                  value={
                    question ? (question.imageKey ?? "") : (field.value ?? "")
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="explanation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (shown after answer)</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="explanationImageKey"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation Image (shown after answer)</FormLabel>
              <FormControl>
                <Uploader
                  fileTypeAccepted="image"
                  onChange={field.onChange}
                  value={
                    question
                      ? (question.explanationImageKey ?? "")
                      : (field.value ?? "")
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="explanationVideoKey"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation Video (shown after answer)</FormLabel>
              <FormControl>
                <Uploader
                  fileTypeAccepted="video"
                  onChange={field.onChange}
                  value={
                    question
                      ? (question.explanationVideoKey ?? "")
                      : (field.value ?? "")
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending
            ? question
              ? "Updating..."
              : "Creating..."
            : question
              ? "Update"
              : "Create"}
        </Button>
      </form>
    </Form>
  );
}
