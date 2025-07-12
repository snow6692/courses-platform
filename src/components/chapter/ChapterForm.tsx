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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Chapter } from "@/lib/generated/prisma";
import { chapterSchema, ChapterSchemaType } from "@/validation/chapter.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tryCatch } from "@/hooks/try-catch";
import { createChapter } from "@/actions/chapter.action";
import { toast } from "sonner";
function ChapterForm({
  courseId,
  chapter,
}: {
  courseId: string;
  chapter?: Chapter;
}) {
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: chapter
      ? {
          courseId: courseId,
          name: chapter.title ?? "",
        }
      : {
          courseId: courseId,
          name: "",
        },
  });

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleOpenChange = (open: boolean) => {
    if (!open || !chapter) {
      form.reset();
    }
    setOpen(open);
  };

  const onSubmit = async (values: ChapterSchemaType) => {
    if (chapter) {
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(createChapter(values));

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
        <Button variant={"outline"} size={"sm"} className="gap-2">
          <PlusIcon className="size-4" /> New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Chapter</DialogTitle>
          <DialogDescription>
            Create your new chapter right here
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter chapter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isPending}
                type="submit"
                className={`w-full cursor-pointer`}
              >
                {chapter
                  ? isPending
                    ? "Updating Chapter..."
                    : `Update Chapter`
                  : isPending
                    ? "Creating Chapter..."
                    : `Create Chapter`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChapterForm;
