"use client";

import { ProfileData } from "@/app/data/user/get-profile-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

interface InvoicesTabProps {
  enrollments: ProfileData["enrollments"];
}

export function InvoicesTab({ enrollments }: InvoicesTabProps) {
  const { t, language } = useLanguage();

  const downloadAllInvoicesCSV = () => {
    const csvData: string[] = [];

    // CSV Header
    csvData.push("Invoice Number,Course Title,Amount,Currency,Date,Status");

    enrollments.forEach((enrollment, index) => {
      const invoiceNumber = `INV-${new Date(enrollment.createdAt).getFullYear()}${(index + 9489).toString().padStart(4, "0")}`;
      const date = new Date(enrollment.createdAt).toLocaleDateString("en-US");

      // Escape fields that might contain commas
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
          escapeCsvField(enrollment.Course.title),
          enrollment.amount,
          "SAR",
          date,
          "Paid",
        ].join(","),
      );
    });

    // Create and download CSV file
    const csvContent = csvData.join("\n");
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `my-invoices-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("profile.invoices.title")}</h2>
        {enrollments.length > 0 && (
          <Button
            onClick={downloadAllInvoicesCSV}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {t("profile.invoices.download")}
          </Button>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p>{t("profile.invoices.no_invoices")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="dark:bg-muted bg-gray-50">
                <TableHead className="font-semibold">
                  {t("profile.invoices.invoice_number")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("profile.invoices.date")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("profile.invoices.course")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("profile.invoices.amount")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("profile.invoices.status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment, index) => {
                const invoiceNumber = `INV-${new Date(enrollment.createdAt).getFullYear()}${(index + 9489).toString().padStart(4, "0")}`;
                const invoiceDate = new Date(
                  enrollment.createdAt,
                ).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                  year: "numeric",
                  month: language === "ar" ? "2-digit" : "long",
                  day: "numeric",
                });

                return (
                  <TableRow
                    key={enrollment.id}
                    className="dark:hover:bg-muted/50 hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      {invoiceNumber}
                    </TableCell>
                    <TableCell>{invoiceDate}</TableCell>
                    <TableCell>{enrollment.Course.title}</TableCell>
                    <TableCell>
                      {enrollment.amount} {t("profile.invoices.currency")}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {t("profile.invoices.paid")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
