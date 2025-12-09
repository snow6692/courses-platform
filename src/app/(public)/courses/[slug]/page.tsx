import { getCourse } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import { CourseEnrollmentCard } from "@/components/course/CourseEnrollmentCard";
import { CourseHeroSection } from "@/components/course/CourseHeroSection";
import { CourseDescriptionSection } from "@/components/course/CourseDescriptionSection";
import { CourseContentSection } from "@/components/course/CourseContentSection";
import {
  CourseHeroSkeleton,
  CourseEnrollmentCardSkeleton,
  CourseContentSkeleton,
} from "@/components/course/CourseDetailSkeletons";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface IProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
    },
  });
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

async function CoursePage({ params }: IProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      {/* Hero Section with bg-bg-hero background */}
      <section className="bg-bg-hero px-4 py-12 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Enrollment Card - Left Side (Sticky) */}
            <div className="order-2 lg:col-span-1">
              <Suspense fallback={<CourseEnrollmentCardSkeleton />}>
                <EnrollmentCardContent slug={slug} />
              </Suspense>
            </div>
            {/* Course Hero - Right Side */}
            <div className="order-1 lg:col-span-2">
              <Suspense fallback={<CourseHeroSkeleton />}>
                <CourseHeroContent slug={slug} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      

      {/* Content Section with white background */}
      <section className="bg-white px-4 py-12 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Course Description and Content - Left Side */}
            <div className="lg:col-span-2">
              <Suspense fallback={<div className="h-64" />}>
                <CourseDescriptionContent slug={slug} />
              </Suspense>

              <div className="mt-12">
                <Suspense fallback={<CourseContentSkeleton />}>
                  <CourseContentSectionWrapper slug={slug} />
                </Suspense>
              </div>
            </div>

            {/* Empty space to align with enrollment card */}
            <div className="hidden lg:col-span-1 lg:block" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoursePage;

// Separate async components for Suspense boundaries

async function CourseHeroContent({ slug }: { slug: string }) {
  const course = await getCourse(slug);
  if (!course) notFound();

  return <CourseHeroSection course={course} />;
}

async function EnrollmentCardContent({ slug }: { slug: string }) {
  const course = await getCourse(slug);
  if (!course) notFound();

  const isEnrolled = await checkIfCourseBought(course.id);

  return <CourseEnrollmentCard course={course} isEnrolled={isEnrolled} />;
}

async function CourseDescriptionContent({ slug }: { slug: string }) {
  const course = await getCourse(slug);
  if (!course) notFound();

  return <CourseDescriptionSection description={course.description} />;
}

async function CourseContentSectionWrapper({ slug }: { slug: string }) {
  const course = await getCourse(slug);
  if (!course) notFound();

  const isEnrolled = await checkIfCourseBought(course.id);

  return <CourseContentSection course={course} isEnrolled={isEnrolled} />;
}
