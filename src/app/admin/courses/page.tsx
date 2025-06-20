import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function CoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your courses</h1>
        <Link
          href="/admin/courses/create"
          className={buttonVariants({ variant: "default" })}
        >
          Create course
        </Link>
      </div>

      <div className="mt-4">
        <h1>Here are all courses</h1>
      </div>
    </div>
  );
}

export default CoursesPage;
