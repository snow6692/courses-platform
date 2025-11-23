"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { enrollInCourse } from "@/actions/enrollment.action";
import { Loader2 } from "lucide-react";

function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollInCourse(courseId));
      //Failed on client side
      if (error) {
        toast.error("An unexpected error occurred. try again later");
        return;
      }

      // Server side status check
      if (result.status === "success") {
        toast.success(result.message);

        return;
      } else if (result.status === "error") {
        toast.error(result.message);
        return;
      }
    });
  }
  return (
    <Button className="w-full" onClick={onSubmit} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Enrolling...
        </>
      ) : (
        " Enroll Now!"
      )}
    </Button>
  );
}

export default EnrollmentButton;
