"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconDownload,
  IconMail,
  IconPhone,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useLanguage } from "@/providers/LanguageContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Student {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  enrollments: {
    id: string;
    createdAt: Date;
    amount: number;
    Course: {
      id: string;
      title: string;
      slug: string;
      price: number;
    };
  }[];
}

interface StudentsTableProps {
  students: Student[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function StudentsTable({
  students,
  currentPage,
  totalPages,
  totalCount,
}: StudentsTableProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Calculate grand total of all payments
  const grandTotal = students.reduce((acc, student) => {
    return (
      acc +
      student.enrollments.reduce(
        (sum, e) => sum + (e.amount || e.Course.price),
        0,
      )
    );
  }, 0);

  const downloadAllInvoicesCSV = () => {
    const csvData: string[] = [];

    // CSV Header
    csvData.push(
      "Invoice Number,Student Name,Student Email,Student Phone,Course Title,Amount,Currency,Date,Status",
    );

    let invoiceIndex = 9489;
    let totalAmount = 0;

    students.forEach((student) => {
      student.enrollments.forEach((enrollment) => {
        const invoiceNumber = `INV-${new Date(enrollment.createdAt).getFullYear()}${(invoiceIndex++).toString().padStart(4, "0")}`;
        const date = new Date(enrollment.createdAt).toLocaleDateString("en-US");
        const amount = enrollment.amount || enrollment.Course.price;
        totalAmount += amount;

        const escapeCsvField = (field: string) => {
          if (
            field.includes(",") ||
            field.includes('"') ||
            field.includes("\n")
          ) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        };

        csvData.push(
          [
            invoiceNumber,
            escapeCsvField(student.name || "N/A"),
            student.email,
            student.phoneNumber || "N/A",
            escapeCsvField(enrollment.Course.title),
            amount,
            "SAR",
            date,
            "Paid",
          ].join(","),
        );
      });
    });

    // Add empty row and total
    csvData.push("");
    csvData.push(`,,,,Total,${totalAmount},SAR,,`);

    const csvContent = csvData.join("\n");
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `all-invoices-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (students.length === 0) {
    return (
      <div className="dark:bg-card rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-500">{t("admin.students.no_students")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats and download button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-violet-200 bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-4 py-2 dark:border-violet-800">
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              👥 {totalCount} {t("admin.students.title")}
            </span>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-2 dark:border-emerald-800">
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              💰 {grandTotal.toLocaleString()}{" "}
              {language === "ar" ? "ر.س" : "SAR"}
            </span>
          </div>
        </div>
        <Button
          onClick={downloadAllInvoicesCSV}
          variant="outline"
          className="gap-2"
        >
          <IconDownload className="size-4" />
          {t("admin.students.download_invoices")}
        </Button>
      </div>

      {/* Table */}
      <div className="dark:bg-card overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dark:bg-muted bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.recent_enrollments.student")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.students.contact")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.students.enrolled_courses")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-500">
                  {t("admin.students.total_paid")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student) => {
                const totalSpent = student.enrollments.reduce(
                  (acc, e) => acc + (e.amount || e.Course.price),
                  0,
                );

                return (
                  <tr
                    key={student.id}
                    className="dark:hover:bg-muted/50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{student.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {student.phoneNumber && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <IconPhone className="size-3" />
                            <span>{student.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <IconMail className="size-3" />
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {student.enrollments.slice(0, 3).map((enrollment) => (
                          <Badge
                            key={enrollment.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {enrollment.Course.title}
                          </Badge>
                        ))}
                        {student.enrollments.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.enrollments.length - 3}{" "}
                            {t("dashboard.more")}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {student.enrollments.length}{" "}
                        {t("admin.students.courses_count")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600">
                        {totalSpent} {language === "ar" ? "ر.س" : "SAR"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-sm">
            {language === "ar"
              ? `صفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="gap-1"
            >
              <IconChevronLeft className="size-4" />
              {language === "ar" ? "السابق" : "Previous"}
            </Button>

            {/* Page numbers */}
            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="size-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="gap-1"
            >
              {language === "ar" ? "التالي" : "Next"}
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
