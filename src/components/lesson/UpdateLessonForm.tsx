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

interface IProps {
  lesson: AdminLessonType;
  chapterId: string;
  courseId: string;
}
function UpdateLessonForm({ chapterId, lesson, courseId }: IProps) {
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      courseId: courseId,
      chapterId: chapterId,
      name: lesson.title,
      description: lesson.description ?? "",
      thumbnailKey: lesson.thumbnailKey ?? undefined,
      videoKey: lesson.videoKey ?? undefined,
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
        toast.error("An unexpected error occurred, Please try again.");
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
        <span>Go Back</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson{" "}
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
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson name" {...field} />
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
                    <FormLabel>Lesson Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="thumbnailKey"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
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
                    <FormLabel>Video File</FormLabel>
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
                {pending ? "Updating Lesson..." : "Update Lesson"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateLessonForm;
