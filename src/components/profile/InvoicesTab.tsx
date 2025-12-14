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
import jsPDF from "jspdf";

interface InvoicesTabProps {
  enrollments: ProfileData["enrollments"];
}

export function InvoicesTab({ enrollments }: InvoicesTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="mb-6 text-2xl font-bold">{t("profile.invoices.title")}</h2>

      {enrollments.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p>{t("profile.invoices.no_invoices")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-right font-semibold">
                  {t("profile.invoices.invoice_number")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("profile.invoices.date")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("profile.invoices.course")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("profile.invoices.amount")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("profile.invoices.status")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("profile.invoices.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment, index) => (
                <InvoiceRow
                  key={enrollment.id}
                  enrollment={enrollment}
                  index={index}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function InvoiceRow({
  enrollment,
  index,
}: {
  enrollment: ProfileData["enrollments"][0];
  index: number;
}) {
  const { t, language } = useLanguage();

  const invoiceDateAr = new Date(enrollment.createdAt).toLocaleDateString(
    "ar-SA",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  );

  const invoiceDateEn = new Date(enrollment.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // Generate invoice number
  const invoiceNumber = `INV-${new Date(enrollment.createdAt).getFullYear()}${(index + 9489).toString().padStart(4, "0")}`;

  const handleDownload = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryRed = [220, 38, 38] as const;
    const darkText = [31, 41, 55] as const;
    const grayText = [107, 114, 128] as const;
    const lightBg = [249, 250, 251] as const;
    const greenBadge = [34, 197, 94] as const;

    // ========== HEADER BAR ==========
    doc.setFillColor(...primaryRed);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Logo/Brand
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("SPIDER", pageWidth / 2, 22, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Learning Platform", pageWidth / 2, 35, { align: "center" });

    // ========== INVOICE TITLE ==========
    doc.setTextColor(...darkText);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 20, 70);

    // Invoice number badge
    doc.setFillColor(...lightBg);
    doc.roundedRect(pageWidth - 80, 55, 60, 22, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(...grayText);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceNumber, pageWidth - 50, 69, { align: "center" });

    // ========== INVOICE DETAILS ==========
    // Left column - Invoice info
    doc.setFontSize(10);
    doc.setTextColor(...grayText);
    doc.text("Invoice Date", 20, 95);
    doc.setTextColor(...darkText);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(invoiceDateEn, 20, 105);

    doc.setFontSize(10);
    doc.setTextColor(...grayText);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Status", 20, 120);

    // Paid badge
    doc.setFillColor(...greenBadge);
    doc.roundedRect(20, 125, 35, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PAID", 37.5, 134, { align: "center" });

    // ========== DIVIDER ==========
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 155, pageWidth - 20, 155);

    // ========== COURSE DETAILS TABLE ==========
    doc.setTextColor(...darkText);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 20, 170);

    // Table header
    doc.setFillColor(...lightBg);
    doc.rect(20, 180, pageWidth - 40, 15, "F");

    doc.setFontSize(10);
    doc.setTextColor(...grayText);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 190);
    doc.text("Amount", pageWidth - 45, 190);

    // Table row
    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(enrollment.Course.title, 25, 210);
    doc.text("Course Enrollment", 25, 220);

    doc.setFont("helvetica", "bold");
    doc.text(`${enrollment.amount} SAR`, pageWidth - 45, 215);

    // ========== TOTAL ==========
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 235, pageWidth - 20, 235);

    doc.setFillColor(...lightBg);
    doc.rect(pageWidth - 100, 240, 80, 25, "F");

    doc.setFontSize(10);
    doc.setTextColor(...grayText);
    doc.setFont("helvetica", "normal");
    doc.text("Total Amount", pageWidth - 95, 252);

    doc.setFontSize(18);
    doc.setTextColor(...primaryRed);
    doc.setFont("helvetica", "bold");
    doc.text(`${enrollment.amount} SAR`, pageWidth - 25, 258, {
      align: "right",
    });

    // ========== FOOTER ==========
    doc.setDrawColor(...primaryRed);
    doc.setLineWidth(2);
    doc.line(20, pageHeight - 35, pageWidth - 20, pageHeight - 35);

    doc.setTextColor(...grayText);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for choosing Spider Learning Platform!",
      pageWidth / 2,
      pageHeight - 25,
      { align: "center" },
    );
    doc.text(
      "For support: support@spider.com | www.spider.com",
      pageWidth / 2,
      pageHeight - 18,
      { align: "center" },
    );

    // Save
    doc.save(`invoice-${invoiceNumber}.pdf`);
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{invoiceNumber}</TableCell>
      <TableCell>{language === "ar" ? invoiceDateAr : invoiceDateEn}</TableCell>
      <TableCell>{enrollment.Course.title}</TableCell>
      <TableCell>
        {enrollment.amount} {t("profile.invoices.currency")}
      </TableCell>
      <TableCell>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          {t("profile.invoices.paid")}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="link"
          size="sm"
          className="gap-1 text-red-600 hover:text-red-700"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          {t("profile.invoices.download")}
        </Button>
      </TableCell>
    </TableRow>
  );
}
