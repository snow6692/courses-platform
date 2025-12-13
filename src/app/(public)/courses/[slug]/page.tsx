import { Suspense } from "react";
import { notFound } from "next/navigation";

import prisma from "@/lib/db";
import { getCourse } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";

import { CourseHeroSection } from "@/components/course/CourseHeroSection";
import { CourseEnrollmentCard } from "@/components/course/CourseEnrollmentCard";
import { CourseDescriptionSection } from "@/components/course/CourseDescriptionSection";
import { CourseContentSection } from "@/components/course/CourseContentSection";

import {
  CourseHeroSkeleton,
  CourseEnrollmentCardSkeleton,
  CourseContentSkeleton,
} from "@/components/course/CourseDetailSkeletons";
import { getServerLocale } from "@/lib/i18n";

interface IProps {
  params: Promise<{ slug: string }>;
}

// Static Params

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });

  return courses.map((course) => ({
    slug: course.slug,
  }));
}

// Page

async function CoursePage({ params }: IProps) {
  const { slug } = await params;
  const { dir } = await getServerLocale();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-bg-hero px-4 py-12 md:px-16" dir={dir}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col-reverse gap-10 lg:flex-row lg:justify-between lg:gap-20">
            {/* Left */}
            <div className="flex-1">
              <Suspense fallback={<CourseHeroSkeleton />}>
                <CourseHeroContent slug={slug} />
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100" />
                }
              >
                <CourseDescriptionContent slug={slug} />
              </Suspense>
            </div>

            {/* Right */}
            <div className="w-full flex-1 shrink-0 lg:w-[380px]">
              <Suspense fallback={<CourseEnrollmentCardSkeleton />}>
                <EnrollmentCardContent slug={slug} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white px-4 py-12 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="mt-12 lg:col-span-2">
              <Suspense fallback={<CourseContentSkeleton />}>
                <CourseContentSectionWrapper slug={slug} />
              </Suspense>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoursePage;

// Suspense Components

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
