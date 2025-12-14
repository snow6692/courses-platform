"use client";
import React, { useState, useTransition } from "react";
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
import { Check, ChevronsUpDown, SparklesIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { createCourse, updateCourse } from "../../actions/course.action";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";
import { Course } from "@/lib/db";
import { CourseLevelEnum, CourseStatusEnum } from "@/lib/course-enums";

interface CourseFormProps {
  course?: Partial<Course>;
}

function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const { triggerConfetti } = useConfetti();

  const [isSubmitting, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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
          level: course.level ?? CourseLevelEnum.BEGINNER,
          status: course.status ?? CourseStatusEnum.DRAFT,
          category: (course.category ??
            CATEGORIES[0]) as CourseSchemaType["category"],
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
          level: CourseLevelEnum.BEGINNER,
          category: "Development",
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
          toast.error("Failed to update course, Try again later");
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
        toast.error("Failed to create course, Try again later");
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
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    {...field}
                    placeholder="Enter course title"
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
                <FormLabel htmlFor="description">Description</FormLabel>
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
                <FormLabel htmlFor="fileKey">Thumbnail Image</FormLabel>
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
                <FormLabel htmlFor="pdfKey">Course PDF (Optional)</FormLabel>
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
                  <FormLabel htmlFor="slug">Slug</FormLabel>
                  <FormControl>
                    <Input id="slug" {...field} placeholder="Enter slug" />
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
              Generate Slug <SparklesIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.value || "Select category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup heading="Categories">
                              {CATEGORIES.filter((category) =>
                                category
                                  .toLowerCase()
                                  .includes(search.toLowerCase()),
                              ).map((category) => (
                                <CommandItem
                                  key={category}
                                  value={category}
                                  onSelect={() => {
                                    field.onChange(category);
                                    setOpen(false);
                                    setSearch("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {category}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Level */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="level">Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="level" className="w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CourseLevelEnum.BEGINNER}>
                          Beginner
                        </SelectItem>
                        <SelectItem value={CourseLevelEnum.INTERMEDIATE}>
                          Intermediate
                        </SelectItem>
                        <SelectItem value={CourseLevelEnum.ADVANCED}>
                          Advanced
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* price, duration,, status */}

          <div className="flex flex-col gap-4 md:flex-row">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="price">Price</FormLabel>
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
                      placeholder="Enter price"
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
                  <FormLabel htmlFor="duration">Duration (hours)</FormLabel>
                  <FormControl>
                    <Input
                      id="duration"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter duration"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category */}
          </div>
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="status">Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseStatusEnum.DRAFT}>
                        Draft
                      </SelectItem>
                      <SelectItem value={CourseStatusEnum.PUBLISHED}>
                        Published
                      </SelectItem>
                      <SelectItem value={CourseStatusEnum.ARCHIVED}>
                        Archived
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
                  Small Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="smallDescription"
                    {...field}
                    placeholder="Enter short description"
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
                Reset
              </Button>
            }
            title="Reset Form"
            description="Are you sure you want to reset all fields? This action cannot be undone."
            confirmLabel="Reset"
            onConfirm={handleReset}
            confirmVariant="destructive"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : course
                ? "Update Course"
                : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CourseForm;
