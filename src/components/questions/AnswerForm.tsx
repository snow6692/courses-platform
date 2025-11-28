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
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { createAnswerSchema, createAnswerType } from "@/validation/answer.zod";
import { createAnswer } from "@/actions/quiz/answer.action";

export default function AnswerForm({
  questionId,
  courseId,
}: {
  questionId: string;
  courseId: string;
}) {
  const form = useForm<createAnswerType>({
    resolver: zodResolver(createAnswerSchema),
    defaultValues: {
      questionId,
      text: "",
      isCorrect: false,
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

  const onSubmit = (values: createAnswerType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createAnswer(values,courseId));

      if (error) {
        toast.error("An unexpected error occurred, Please try again.");
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
        <Button variant="outline" className="w-full justify-center gap-1">
          <PlusIcon className="size-4" />
          New Answer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Answer</DialogTitle>
          <DialogDescription>
            Add a new answer to the question here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="text"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter answer text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                className="w-full cursor-pointer"
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? "Creating Answer..." : "Create New Answer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
