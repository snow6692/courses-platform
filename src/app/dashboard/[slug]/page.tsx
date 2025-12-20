import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import { getServerLocale } from "@/lib/i18n";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

interface IProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugPage({ params }: IProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);
  const { locale } = await getServerLocale();
  const t = locale === "ar" ? ar : en;

  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter?.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex h-full items-center justify-center text-center">
      <h2 className="mb-2 text-2xl font-bold">
        {t.common.no_lessons_available}
      </h2>
      <p className="text-muted-foreground">{t.common.no_lessons_message}</p>
    </div>
  );
}
