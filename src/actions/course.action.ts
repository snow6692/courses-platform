"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { APIResponse } from "@/lib/types";
import { CourseSchemaType, courseSchema } from "@/validation/course.zod";
import { revalidatePath } from "next/cache";

export async function createCourse(
  data: CourseSchemaType,
): Promise<APIResponse> {
  const session = await requireAdmin();

  try {
    const userId = session?.user.id;
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to create a course",
      };
    }

    const parsedData = courseSchema.safeParse(data);
    if (!parsedData.success) {
      return {
        status: "error",
        message: parsedData.error.message,
      };
    }

    const stripeData = await stripe.products.create({
      name: parsedData.data.title,
      description: parsedData.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: parsedData.data.price * 100,
      },
    });

    const result = await await prisma.course.create({
      data: {
        ...parsedData.data,
        userId: userId as string,
        stripePriceId: stripeData.default_price as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}

export async function updateCourse(
  id: string,
  data: CourseSchemaType,
): Promise<APIResponse> {
  await requireAdmin();
  try {
    const parsedData = courseSchema.safeParse(data);
    if (!parsedData.success) {
      return {
        status: "error",
        message: parsedData.error.message,
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    // Any admin can update any course (requireAdmin already checks for admin role)
    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },
      data: { ...parsedData.data },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

export async function deleteCourse(courseId: string): Promise<APIResponse> {
   await requireAdmin();

  try {
    await prisma.course.delete({ where: { id: courseId } });
    revalidatePath("/admin/courses");
    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}
