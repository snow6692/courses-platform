import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CourseForm from "../../../../../components/course/CourseForm";
import CourseStructure from "../../../../../components/course/CourseStructure";
import { QuizButton } from "@/components/quiz/admin/QuizButton";
import { adminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getServerLocale } from "@/lib/i18n";

interface AdminCourseEditPageProps {
  params: Promise<{ courseId: string }>;
}

async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const courseId = (await params).courseId;
  const data = await adminGetCourse(courseId);
  const existingQuiz = await adminGetQuizOfCourse(courseId);
  const { t } = await getServerLocale();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        {t("admin.course_edit.edit_course")}{" "}
        <span className="text-primary underline">{data.title}</span>{" "}
      </h1>
      <Tabs defaultValue="course-structure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">
            {t("admin.course_edit.basic_info_tab")}
          </TabsTrigger>
          <TabsTrigger value="course-structure">
            {t("admin.course_edit.course_structure_tab")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.course_edit.basic_info_title")}</CardTitle>
              <CardDescription>
                {t("admin.course_edit.basic_info_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseForm course={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>
                  {t("admin.course_edit.course_structure_title")}
                </CardTitle>
                {/* Quiz fro course */}
                {existingQuiz ? (
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    href={`/admin/courses/${courseId}/quiz`}
                  >
                    {t("admin.course_edit.update_quiz")}
                  </Link>
                ) : (
                  <QuizButton
                    quizType="COURSE"
                    courseId={courseId}
                    existingQuiz={existingQuiz!}
                  />
                )}
              </div>
              <CardDescription>
                {t("admin.course_edit.course_structure_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminCourseEditPage;
