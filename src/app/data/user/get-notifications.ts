import prisma from "@/lib/db";
import { requireUser } from "./require-user";

export type NotificationType =
  | "PROGRESS_50"
  | "PROGRESS_100"
  | "NEW_LESSON"
  | "NEW_QUIZ";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  courseTitle: string;
  courseSlug: string;
  createdAt: Date;
}

export async function getUserNotifications(): Promise<Notification[]> {
  const user = await requireUser();
  const notifications: Notification[] = [];

  // Get all enrolled courses with their content
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "SUCCESSFUL",
    },
    select: {
      id: true,
      createdAt: true,
      Course: {
        select: {
          id: true,
          title: true,
          slug: true,
          chapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  createdAt: true,
                  lessonProgress: {
                    where: { userId: user.id },
                    select: { completed: true },
                  },
                },
              },
              quizzes: {
                select: {
                  id: true,
                  createdAt: true,
                },
              },
            },
          },
          quizzes: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  for (const enrollment of enrollments) {
    const course = enrollment.Course;

    // Calculate progress
    const allLessons = course.chapters.flatMap((ch) => ch.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) =>
      l.lessonProgress.some((p) => p.completed),
    ).length;

    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Progress milestone notifications
    if (progress >= 100 && totalLessons > 0) {
      notifications.push({
        id: `${course.id}-complete`,
        type: "PROGRESS_100",
        title: "أكملت الكورس! 🎉",
        message: `تهانينا! أكملت جميع دروس "${course.title}"`,
        courseTitle: course.title,
        courseSlug: course.slug,
        createdAt: new Date(),
      });
    } else if (progress >= 50 && progress < 100 && totalLessons > 0) {
      notifications.push({
        id: `${course.id}-half`,
        type: "PROGRESS_50",
        title: "نصف الطريق! 💪",
        message: `أكملت 50% من "${course.title}" - استمر!`,
        courseTitle: course.title,
        courseSlug: course.slug,
        createdAt: new Date(),
      });
    }

    // New lessons (added after enrollment)
    const newLessons = allLessons.filter(
      (l) => new Date(l.createdAt) > new Date(enrollment.createdAt),
    );

    if (newLessons.length > 0) {
      const latestLesson = newLessons.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      notifications.push({
        id: `${course.id}-new-lesson-${latestLesson.id}`,
        type: "NEW_LESSON",
        title: "درس جديد متاح! 📚",
        message: `تمت إضافة درس "${latestLesson.title}" في "${course.title}"`,
        courseTitle: course.title,
        courseSlug: course.slug,
        createdAt: new Date(latestLesson.createdAt),
      });
    }

    // New quizzes (chapter quizzes + course quizzes)
    const allQuizzes = [
      ...course.chapters.flatMap((ch) => ch.quizzes),
      ...course.quizzes,
    ];

    const newQuizzes = allQuizzes.filter(
      (q) => new Date(q.createdAt) > new Date(enrollment.createdAt),
    );

    if (newQuizzes.length > 0) {
      notifications.push({
        id: `${course.id}-new-quiz`,
        type: "NEW_QUIZ",
        title: "اختبار جديد متاح! 📝",
        message: `تمت إضافة اختبار جديد في "${course.title}"`,
        courseTitle: course.title,
        courseSlug: course.slug,
        createdAt: new Date(
          Math.max(...newQuizzes.map((q) => new Date(q.createdAt).getTime())),
        ),
      });
    }
  }

  // Sort by date (newest first)
  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
