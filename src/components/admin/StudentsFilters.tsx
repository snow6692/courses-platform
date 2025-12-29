"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch } from "@tabler/icons-react";
import { useCallback, useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageContext";

interface Course {
  id: string;
  title: string;
  slug: string;
  _count: {
    enrollments: number;
  };
}

interface StudentsFiltersProps {
  courses: Course[];
}

export function StudentsFilters({ courses }: StudentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page when filters change
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        router.push(`${pathname}?${createQueryString("search", searchValue)}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, pathname, router, createQueryString, searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCourseChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString("course", value === "all" ? "" : value)}`,
    );
  };

  const handleBannedChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString("banned", value === "all" ? "" : value)}`,
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative max-w-md flex-1">
        <IconSearch className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t("admin.students.search_placeholder")}
          value={searchValue}
          onChange={handleSearchChange}
          className="ps-10"
        />
      </div>

      <Select
        defaultValue={searchParams.get("course") || "all"}
        onValueChange={handleCourseChange}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder={t("admin.students.all_courses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("admin.students.all_courses")}</SelectItem>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.slug}>
              {course.title} ({course._count.enrollments})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("banned") || "all"}
        onValueChange={handleBannedChange}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={t("admin.students.all_status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("admin.students.all_status")}</SelectItem>
          <SelectItem value="banned">
            {t("admin.students.banned_only")}
          </SelectItem>
          <SelectItem value="active">
            {t("admin.students.active_only")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
