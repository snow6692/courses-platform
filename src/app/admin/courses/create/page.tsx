import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CourseForm from "../../../../components/course/CourseForm";
import { getServerLocale } from "@/lib/i18n";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

async function CreateCoursePage() {
  const { locale } = await getServerLocale();
  const t = locale === "ar" ? ar : en;

  return (
    <div>
      <div className="flex items-center gap-4">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>

        <h1 className="text-2xl font-bold">{t.admin.forms.create_courses}</h1>
      </div>

      {/* form */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            {t.admin.course_form?.basic_info || "Basic information"}
          </CardTitle>
          <CardDescription>
            {t.admin.course_form?.basic_info_desc ||
              "Fill in the basic information for your course"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCoursePage;
