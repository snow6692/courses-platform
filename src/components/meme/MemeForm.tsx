"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMeme } from "@/actions/meme/meme.action";
import { createMemeSchema, CreateMemeSchema } from "@/validation/meme.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import Uploader from "../file-uploader/Uploader";
import { MemeTrigger, MemeType } from "@/lib/enums";
import { useQueryClient } from "@tanstack/react-query";

export default function MemeForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<CreateMemeSchema>({
    resolver: zodResolver(createMemeSchema),
    defaultValues: {
      trigger: "RANDOM",
      type: "IMAGE",
    },
  });

  const onSubmit = (values: CreateMemeSchema) => {
    startTransition(async () => {
      const result = await createMeme(values);
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        // Invalidate React Query cache for instant update
        queryClient.invalidateQueries({ queryKey: ["global-memes"] });
        onSuccess?.();
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meme Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Clear fileKey when type changes
                  form.setValue("fileKey", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(MemeType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional uploader based on type */}
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.watch("type") === "VIDEO" ? "Video File" : "Image File"}
              </FormLabel>
              <FormControl>
                <Uploader
                  onChange={(key: string) => field.onChange(key)}
                  value={field.value}
                  fileTypeAccepted={
                    form.watch("type") === "VIDEO" ? "video" : "image"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trigger selector */}
        <FormField
          control={form.control}
          name="trigger"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(MemeTrigger).map((trigger) => (
                    <SelectItem key={trigger} value={trigger}>
                      {trigger}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Add Meme"}
        </Button>
      </form>
    </Form>
  );
}
