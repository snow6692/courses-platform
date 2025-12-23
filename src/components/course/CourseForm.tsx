"use client";
import React, { useTransition } from "react";
import { courseSchema, CourseSchemaType } from "@/validation/course.zod";
import slugify from "slugify";
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
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { createCourse, updateCourse } from "../../actions/course.action";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";
import { Course } from "@/lib/db";
import { CourseStatusEnum } from "@/lib/course-enums";
import { useLanguage } from "@/providers/LanguageContext";

interface CourseFormProps {
  course?: Partial<Course>;
}

function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const { triggerConfetti } = useConfetti();
  const { t } = useLanguage();

  const [isSubmitting, startTransition] = useTransition();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title ?? "",
          description: course.description ?? "",
          fileKey: course.fileKey ?? "",
          pdfKey: course.pdfKey ?? "",
          price: course.price ?? 0,
          duration: course.duration ?? 1,
          status: course.status ?? CourseStatusEnum.DRAFT,
          smallDescription: course.smallDescription ?? "",
          slug: course.slug ?? "",
        }
      : {
          title: "",
          description: "",
          fileKey: "",
          pdfKey: "",
          price: 0,
          duration: 1,
          smallDescription: "",
          slug: "",
          status: CourseStatusEnum.DRAFT,
        },
  });

  const onSubmit = (values: CourseSchemaType) => {
    //Update Course
    if (course) {
      startTransition(async () => {
        const { data: result, error } = await tryCatch(
          updateCourse(course.id ?? "", values),
        );
        //Failed on client side
        if (error) {
          toast.error(t("admin.course_form.update_failed"));
          return;
        }
        if (result.status === "success") {
          toast.success(result.message);
          triggerConfetti();

          form.reset();
          router.push("/admin/courses");
          return;
        }
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        //Success

        toast.success("Course updated successfully");
        form.reset();
        router.push("/admin/courses");
        return;
      });
      return;
    }

    //Create Course
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createCourse(values));
      //Failed on client side
      if (error) {
        toast.error(t("admin.course_form.create_failed"));
        return;
      }

      // Server side status check
      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();

        form.reset();
        router.push("/admin/courses");
        return;
      } else if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      //Success
      toast.success("Course created successfully");
      triggerConfetti();
      form.reset();

      router.push("/admin/courses");
    });
  };
  const handleReset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-busy={isSubmitting ? "true" : "false"}
        className="space-y-6"
      >
        <div className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">
                  {t("admin.course_form.title")}
                </FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    {...field}
                    placeholder={t("admin.course_form.title_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">
                  {t("admin.course_form.description")}
                </FormLabel>
                <FormControl>
                  <RichTextEditor field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Course File */}
          <FormField
            control={form.control}
            name="fileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="fileKey">
                  {t("admin.course_form.thumbnail_image")}
                </FormLabel>
                <FormControl>
                  <Uploader
                    fileTypeAccepted="image"
                    onChange={field.onChange}
                    value={course ? course.fileKey : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Course PDF */}
          <FormField
            control={form.control}
            name="pdfKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="pdfKey">
                  {t("admin.course_form.course_pdf")}
                </FormLabel>
                <FormControl>
                  <Uploader
                    fileTypeAccepted="pdf"
                    onChange={field.onChange}
                    value={course ? (course.pdfKey ?? undefined) : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <div
            className={cn(
              "flex items-end justify-center",
              form.formState.errors.slug && "items-center",
            )}
          >
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="slug">
                    {t("admin.course_form.slug")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="slug"
                      {...field}
                      placeholder={t("admin.course_form.slug_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              className={cn(form.formState.errors.slug && "mb-1")}
              onClick={() => {
                const titleValue = form.getValues("title");
                const slugValue = slugify(titleValue);
                form.setValue("slug", slugValue, { shouldValidate: true });
              }}
            >
              {t("admin.course_form.generate_slug")}{" "}
              <SparklesIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* price, duration, status */}
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="price">
                    {t("admin.course_form.price")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder={t("admin.course_form.price_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="duration">
                    {t("admin.course_form.duration")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="duration"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      placeholder={t("admin.course_form.duration_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="status">
                  {t("admin.course_form.status")}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue
                        placeholder={t("admin.course_form.status_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseStatusEnum.DRAFT}>
                        {t("admin.course_form.status_draft")}
                      </SelectItem>
                      <SelectItem value={CourseStatusEnum.PUBLISHED}>
                        {t("admin.course_form.status_published")}
                      </SelectItem>
                      <SelectItem value={CourseStatusEnum.ARCHIVED}>
                        {t("admin.course_form.status_archived")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Small Description */}
          <FormField
            control={form.control}
            name="smallDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="smallDescription">
                  {t("admin.course_form.small_description")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="smallDescription"
                    {...field}
                    placeholder={t(
                      "admin.course_form.small_description_placeholder",
                    )}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <ConfirmDialog
            trigger={
              <Button
                variant="outline"
                type="button"
                disabled={isSubmitting}
                className="disabled:opacity-50"
              >
                {t("admin.course_form.reset")}
              </Button>
            }
            title={t("admin.course_form.reset_form")}
            description={t("admin.course_form.reset_confirm")}
            confirmLabel={t("admin.course_form.reset")}
            onConfirm={handleReset}
            confirmVariant="destructive"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="disabled:opacity-50"
          >
            {isSubmitting
              ? t("admin.course_form.submitting")
              : course
                ? t("admin.course_form.update_course")
                : t("admin.course_form.create_course")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CourseForm;
