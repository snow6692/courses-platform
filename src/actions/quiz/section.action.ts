"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { sectionSchema, SectionSchemaType } from "@/validation/section.zod";
import { revalidatePath } from "next/cache";

export async function createSection(
  quizId: string,
  data: SectionSchemaType,
  courseId: string,
) {
  await requireAdmin();

  const parsed = sectionSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.message };
  }

  try {
    // Get max position
    const lastSection = await prisma.quizSection.findFirst({
      where: { quizId },
      orderBy: { position: "desc" },
    });

    const newPosition = (lastSection?.position ?? 0) + 1;

    await prisma.quizSection.create({
      data: {
        ...parsed.data,
        position: newPosition,
        quizId,
        timeLimit: parsed.data.timeLimit ? parsed.data.timeLimit * 60 : null, // Convert minutes to seconds
      },
    });

    revalidatePath(`/admin/courses/${courseId}/quiz`);
    return { status: "success", message: "Section created successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to create section" };
  }
}

export async function updateSection(
  sectionId: string,
  data: SectionSchemaType,
  courseId: string,
) {
  await requireAdmin();

  const parsed = sectionSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.message };
  }

  try {
    await prisma.quizSection.update({
      where: { id: sectionId },
      data: {
        ...parsed.data,
        timeLimit: parsed.data.timeLimit ? parsed.data.timeLimit * 60 : null,
      },
    });

    revalidatePath(`/admin/courses/${courseId}/quiz`);
    return { status: "success", message: "Section updated successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to update section" };
  }
}

export async function deleteSection(sectionId: string, courseId: string) {
  await requireAdmin();

  try {
    await prisma.quizSection.delete({
      where: { id: sectionId },
    });

    revalidatePath(`/admin/courses/${courseId}/quiz`);
    return { status: "success", message: "Section deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete section" };
  }
}

export async function reorderSections(
  quizId: string,
  items: { id: string; position: number }[],
) {
  await requireAdmin();

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.quizSection.update({
          where: { id: item.id },
          data: { position: item.position },
        }),
      ),
    );

    return { status: "success", message: "Sections reordered successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to reorder sections" };
  }
}

export async function reorderQuestionsInSection(
  sectionId: string,
  items: { id: string; position: number }[],
  courseId: string,
) {
  await requireAdmin();

  try {
    {
      await prisma.$transaction(
        items.map((item) =>
          prisma.question.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );

      revalidatePath(`/admin/courses/${courseId}/quiz`);

      return { status: "success", message: "Questions reordered successfully" };
    }
  } catch (error) {
    console.error("Reorder questions in section error:", error);
    return { status: "error", message: "Failed to reorder questions" };
  }
}
