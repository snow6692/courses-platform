"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Ban a student - blocks their access to all courses
 */
export async function banStudent(userId: string, reason: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      banned: true,
      banReason: reason,
    },
  });

  revalidatePath("/admin/students");
  return { success: true };
}

/**
 * Unban a student - restores their access
 */
export async function unbanStudent(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      banned: false,
      banReason: null,
    },
  });

  revalidatePath("/admin/students");
  return { success: true };
}
