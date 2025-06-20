"use client";
import React, { useTransition } from "react";
import { courseSchema, CourseSchemaType } from "@/lib/validation/course.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, CourseLevel, CourseStatus } from "@/lib/generated/prisma";
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
import { useSession } from "@/hooks/useAuthUser";

interface CourseFormProps {
  course?: Partial<Course>; // Allow partial course for flexibility
}

function CourseForm({ course }: CourseFormProps) {
  const {
    session: { user },
    isPending,
  } = useSession();
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title ?? "",
          description: course.description ?? "",
          fileKey: course.fileKey ?? "",
          price: course.price ?? 0,
          duration: course.duration ?? 0,
          level: course.level ?? CourseLevel.BEGINNER,
          status: course.status ?? CourseStatus.DRAFT,
          category: course.category ?? "",
          smallDescription: course.smallDescription ?? "",
          slug: course.slug ?? "",
        }
      : {
          title: "",
          description: "",
          fileKey: "",
          price: 0,
          duration: 0,
          level: CourseLevel.BEGINNER,
          category: "",
          smallDescription: "",
          slug: "",
          status: CourseStatus.DRAFT,
        },
  });

  const onSubmit = async (data: CourseSchemaType) => {
    if (!user) {
      toast.error("You must be logged in to create or update a course");
      router.push("/login");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          course ? `/api/courses/${course.id}` : "/api/courses",
          {
            method: course ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, createdById: user.id }),
          },
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        toast.success(
          course
            ? "Course updated successfully"
            : "Course created successfully",
        );
        form.reset();
        router.push("/dashboard"); // Adjust redirect as needed
      } catch (error: any) {
        toast.error(
          `Failed to ${course ? "update" : "create"} course: ${error?.message}`,
        );
      }
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
      >
        <div className="space-y-4">
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Enter course description"
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="fileKey">Course File</FormLabel>
                <FormControl>
                  <Input
                    id="fileKey"
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                    accept=".pdf,.mp4" // Adjust based on allowed file types
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="level">Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseLevel.BEGINNER}>
                        Beginner
                      </SelectItem>
                      <SelectItem value={CourseLevel.INTERMEDIATE}>
                        Intermediate
                      </SelectItem>
                      <SelectItem value={CourseLevel.ADVANCED}>
                        Advanced
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="category">Category</FormLabel>
                <FormControl>
                  <Input
                    id="category"
                    {...field}
                    placeholder="Enter category"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="slug">Slug</FormLabel>
                <FormControl>
                  <Input id="slug" {...field} placeholder="Enter slug" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      <SelectItem value={CourseStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={CourseStatus.PUBLISHED}>
                        Published
                      </SelectItem>
                      <SelectItem value={CourseStatus.ARCHIVED}>
                        Archived
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <ConfirmDialog
            trigger={
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Reset
              </Button>
            }
            title="Reset Form"
            description="Are you sure you want to reset all fields? This action cannot be undone."
            confirmLabel="Reset"
            onConfirm={handleReset}
            confirmVariant="destructive"
          />
          <Button type="submit" disabled={isSubmitting}>
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
