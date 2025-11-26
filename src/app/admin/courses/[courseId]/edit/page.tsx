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

interface AdminCourseEditPageProps {
  params: Promise<{ courseId: string }>;
}

async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const courseId = (await params).courseId;
  const data = await adminGetCourse(courseId);
  const existingQuiz = await adminGetQuizOfCourse(courseId);
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Edit Course:{" "}
        <span className="text-primary underline">{data.title}</span>{" "}
      </h1>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Edit basic information of the course
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
                <CardTitle>Course Structure</CardTitle>
                <QuizButton
                  quizType="COURSE"
                  courseId={courseId}
                  existingQuiz={existingQuiz!}
                />
              </div>
              <CardDescription>Update your course structure</CardDescription>
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
