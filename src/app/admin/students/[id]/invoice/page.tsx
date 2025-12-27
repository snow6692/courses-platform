import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { PrintButton } from "@/components/admin/PrintButton";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

async function getStudentWithEnrollments(id: string) {
  const student = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      enrollments: {
        select: {
          id: true,
          createdAt: true,
          Course: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return student;
}

async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  const student = await getStudentWithEnrollments(id);

  if (!student) {
    notFound();
  }

  const totalAmount = student.enrollments.reduce(
    (acc, e) => acc + e.Course.price,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/admin/students">
            <Button variant="outline" size="icon">
              <IconArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-gray-500">
              Student: {student.name || student.email}
            </p>
          </div>
        </div>
        <PrintButton />
      </div>

      {/* Invoice Card */}
      <div
        className="rounded-xl border bg-white p-8 print:border-none print:p-0 print:shadow-none"
        id="invoice-content"
      >
        {/* Invoice Header */}
        <div className="mb-8 flex justify-between border-b pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
            <p className="text-gray-500">
              Invoice #{student.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-gray-500">
              Date: {format(new Date(), "PPP", { locale: ar })}
            </p>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-gray-800">Courses Platform</h3>
            <p className="text-gray-500">Saudi Arabia</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="mb-2 text-sm font-medium text-gray-500 uppercase">
            Bill To:
          </h3>
          <p className="font-semibold">{student.name || "N/A"}</p>
          <p className="text-gray-600">{student.email}</p>
          {student.phoneNumber && (
            <p className="text-gray-600">{student.phoneNumber}</p>
          )}
        </div>

        {/* Courses Table */}
        <div className="mb-8 overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Enrollment Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {student.enrollments.map((enrollment, index) => (
                <tr key={enrollment.id}>
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {enrollment.Course.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {format(new Date(enrollment.createdAt), "PPP", {
                      locale: ar,
                    })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {enrollment.Course.price} SAR
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                  Total Amount:
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-green-600">
                  {totalAmount} SAR
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>Thank you for your purchase!</p>
          <p>For any inquiries, please contact support@example.com</p>
        </div>
      </div>
    </div>
  );
}

export default InvoicePage;
