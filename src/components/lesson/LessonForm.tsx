"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LessonSchemaType, lessonSchema } from "@/validation/lesson.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { createLesson } from "@/actions/lesson.action";
import { Switch } from "../ui/switch";
import { useLanguage } from "@/providers/LanguageContext";

export default function LessonForm({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const { t } = useLanguage();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      courseId: courseId,
      chapterId: chapterId,
      name: "",
      description: "",
      thumbnailKey: "",
      videoKey: "",
      isFree: false,
    },
  });

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };

  const onSubmit = (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLesson(values));

      if (error) {
        toast.error(t("common.unexpected_error"));
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full justify-center gap-1">
          <PlusIcon className="size-4" /> {t("admin.forms.new_lesson")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("admin.forms.create_lesson_title")}</DialogTitle>
          <DialogDescription>
            {t("admin.forms.create_lesson_desc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.forms.lesson_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("admin.forms.enter_lesson_name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is free */}
            <FormField
              name="isFree"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("admin.forms.free_preview")}
                    </FormLabel>
                    <FormDescription>
                      {t("admin.forms.free_preview_desc")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className={`w-full cursor-pointer`}
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending
                  ? t("admin.forms.creating_lesson")
                  : t("admin.forms.create_new_lesson")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
