"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { CourseSchemaType, courseSchema } from "@/validation/course.zod";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";


const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  );

export async function createCourse(
  data: CourseSchemaType,
): Promise<APIResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return {
          status: "error",
          message: "Too many requests",
        };
      if (decision.reason.isBot())
        return {
          status: "error",
          message: "You are a bot! Please try again later",
        };
    }

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

    const result = await await prisma.course.create({
      data: { ...parsedData.data, userId: userId as string },
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
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return {
          status: "error",
          message: "Too many requests",
        };
      if (decision.reason.isBot())
        return {
          status: "error",
          message: "You are a bot! Please try again later",
        };
    }

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

    const authorized = course.userId === session.user.id;
    if (!authorized) {
      return {
        status: "error",
        message: "You are not authorized to update this course",
      };
    }
    const updatedCourse = await prisma.course.update({
      where: {
        id,
        userId: session.user.id,
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
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return {
          status: "error",
          message: "Too many requests",
        };
      if (decision.reason.isBot())
        return {
          status: "error",
          message: "You are a bot! Please try again later",
        };
    }
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

