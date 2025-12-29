import { Suspense } from "react";
import { adminGetStudents } from "@/app/data/admin/admin-get-students";
import { adminGetAllCourses } from "@/app/data/admin/admin-get-all-courses";
import { StudentsTable } from "@/components/admin/StudentsTable";
import { StudentsFilters } from "@/components/admin/StudentsFilters";
import { StudentsPageHeader } from "@/components/admin/StudentsPageHeader";

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string;
    course?: string;
    banned?: string;
    page?: string;
  }>;
}

async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const courseFilter = params.course || "";
  const bannedFilter = (params.banned as "all" | "banned" | "active") || "all";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 10;

  return (
    <div className="space-y-6">
      <StudentsPageHeader />

      <Suspense fallback={<FiltersLoading />}>
        <FiltersWrapper />
      </Suspense>

      <Suspense fallback={<TableLoading />}>
        <StudentsTableWrapper
          search={search}
          courseFilter={courseFilter}
          bannedFilter={bannedFilter}
          page={page}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}

export default StudentsPage;

async function FiltersWrapper() {
  const courses = await adminGetAllCourses();
  return <StudentsFilters courses={courses} />;
}

async function StudentsTableWrapper({
  search,
  courseFilter,
  bannedFilter,
  page,
  pageSize,
}: {
  search: string;
  courseFilter: string;
  bannedFilter: "all" | "banned" | "active";
  page: number;
  pageSize: number;
}) {
  const { students, totalCount, totalPages } = await adminGetStudents({
    search,
    courseFilter,
    bannedFilter,
    page,
    pageSize,
  });
  return (
    <StudentsTable
      students={students}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}

function FiltersLoading() {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
      <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
}

function TableLoading() {
  return (
    <div className="dark:bg-card overflow-hidden rounded-xl border bg-white">
      <div className="animate-pulse">
        <div className="dark:bg-muted h-12 bg-gray-100" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 border-t p-4">
            <div className="dark:bg-muted h-4 w-32 rounded bg-gray-200" />
            <div className="dark:bg-muted h-4 w-48 rounded bg-gray-200" />
            <div className="dark:bg-muted h-4 w-24 rounded bg-gray-200" />
            <div className="dark:bg-muted h-4 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
