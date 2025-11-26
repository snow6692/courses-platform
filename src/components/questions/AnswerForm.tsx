// components/questions/AnswerForm.tsx
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAnswer } from "@/actions/quiz/question.action";
import { toast } from "sonner";
import { useTransition } from "react";

const schema = z.object({
  text: z.string().min(1, "Answer text is required"),
});

type FormData = z.infer<typeof schema>;

export default function AnswerForm({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await createAnswer({
        questionId,
        text: data.text,
        isCorrect: false,
      });
      if (res.status === "success") {
        toast.success("Answer added successfully");
        form.reset();
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to add answer");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4">
          <Plus className="mr-2 size-4" />
          Add Answer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Answer</DialogTitle>
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
                    <Input {...field} placeholder="Enter the answer..." />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Adding..." : "Add Answer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
