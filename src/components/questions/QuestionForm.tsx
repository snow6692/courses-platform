// components/quiz/QuestionForm.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuestion } from "@/actions/quiz/question.action";
import { toast } from "sonner";

const schema = z.object({
  text: z.string().min(1, "Question text is required"),
  imageKey: z.string().optional(),
  explanation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuestionForm({
  quizId,
  courseId,
}: {
  quizId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      imageKey: "",
      explanation: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await createQuestion({ ...data, quizId }, courseId);
    if (res.status === "success") {
      toast.success("Question created successfully");
      form.reset();
      setOpen(false);
    } else {
      toast.error(res.message || "Failed to create question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 size-4" />
          Add Question
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="text"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your question here..."
                      rows={5}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            <FormField
              name="imageKey"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Key (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="e.g. questions/image-123.jpg"
                    />
                  </FormControl>
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
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Explain why this is the correct answer..."
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Question</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
