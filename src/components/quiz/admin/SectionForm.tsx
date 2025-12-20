"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { sectionSchema, SectionSchemaType } from "@/validation/section.zod";
import { createSection, updateSection } from "@/actions/quiz/section.action";
import { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import { useLanguage } from "@/providers/LanguageContext";

interface SectionFormProps {
  quizId: string;
  courseId: string;
  section?: AdminGetQuizOfCourse["sections"][number];
  onSuccess?: () => void;
}

export default function SectionForm({
  quizId,
  courseId,
  section,
  onSuccess,
}: SectionFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SectionSchemaType>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: section?.title || "",
      timeLimit: section?.timeLimit ? Math.round(section.timeLimit / 60) : 0,
    },
  });

  const onSubmit = (values: SectionSchemaType) => {
    startTransition(async () => {
      let result;
      if (section) {
        result = await updateSection(section.id, values, courseId);
      } else {
        result = await createSection(quizId, values, courseId);
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.forms.section_name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("admin.forms.enter_section_name")}
                  {...field}
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
              <FormLabel>{t("admin.forms.section_time")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("admin.forms.section_time")}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {section ? (
            <>
              {t("admin.quiz.edit_section")} {isPending ? "..." : ""}
            </>
          ) : (
            <>
              {t("admin.forms.create_section")} {isPending ? "..." : ""}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
