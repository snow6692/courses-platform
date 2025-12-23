"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { lessonSchema, LessonSchemaType } from "@/validation/lesson.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import RichTextEditor from "../rich-text-editor/Editor";
import Uploader from "../file-uploader/Uploader";
import { updateLesson } from "@/actions/lesson.action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "../ui/switch";
import { useLanguage } from "@/providers/LanguageContext";

interface IProps {
  lesson: AdminLessonType;
  chapterId: string;
  courseId: string;
}
function UpdateLessonForm({ chapterId, lesson, courseId }: IProps) {
  const { t } = useLanguage();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      courseId: courseId,
      chapterId: chapterId,
      name: lesson.title,
      description: lesson.description ?? "",
      thumbnailKey: lesson.thumbnailKey ?? undefined,
      videoKey: lesson.videoKey ?? undefined,

      isFree: lesson.isFree,
    },
  });
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const onSubmit = (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson({ courseId, lessonId: lesson.id, values }),
      );

      if (error) {
        toast.error(t("common.unexpected_error"));
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };
  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
      >
        <ArrowLeft className="size-4" />
        <span>{t("admin.forms.go_back")}</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.forms.lesson_config")}</CardTitle>
          <CardDescription>
            {t("admin.forms.lesson_config_desc")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.forms.lesson_name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("admin.forms.enter_lesson_name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.forms.lesson_description")}</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
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

              <FormField
                name="thumbnailKey"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.forms.thumbnail_image")}</FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="videoKey"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.forms.video_file")}</FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={pending}>
                {pending
                  ? t("admin.forms.updating_lesson")
                  : t("admin.forms.update_lesson")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateLessonForm;
