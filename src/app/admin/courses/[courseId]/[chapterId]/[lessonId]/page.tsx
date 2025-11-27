import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import UpdateLessonForm from "@/components/lesson/UpdateLessonForm";
type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;


async function LessonPage({ params }: { params: Params }) {
  const { chapterId, courseId, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);
  return (
    <UpdateLessonForm
      chapterId={chapterId}
      lesson={lesson}
      courseId={courseId}
    />
    
  );
}

export default LessonPage;
