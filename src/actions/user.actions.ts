"use server";

import prisma from "@/lib/db";
import { profileFormSchema, ProfileFormValues } from "@/validation/profile.zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "../app/data/user/require-user";
import { env } from "@/lib/config";

export async function updateUser(
  data: ProfileFormValues,
  isGoogleUser: boolean = false,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = profileFormSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { firstName, lastName, ...rest } = result.data;
  const fullName = `${firstName} ${lastName}`;

  // If Google user, don't allow email change
  if (isGoogleUser && rest.email !== session.user.email) {
    throw new Error("لا يمكن تغيير البريد الإلكتروني لحساب Google");
  }

  // Check if email is already taken by another user
  if (rest.email && rest.email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: rest.email,
      },
    });

    if (existingUser) {
      throw new Error("هذا البريد الإلكتروني مستخدم من قبل");
    }
  }

  // Check phone uniqueness if provided
  if (rest.phoneNumber) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phoneNumber: rest.phoneNumber,
        NOT: { id: session.user.id },
      },
    });

    if (existingPhone) {
      throw new Error("رقم الجوال مستخدم من قبل");
    }
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: fullName,
      email: isGoogleUser ? undefined : result.data.email,
      phoneNumber: result.data.phoneNumber || null,
    },
  });

  revalidatePath("/dashboard/profile");

  return { success: true };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Use better-auth's changePassword API which handles hashing correctly (scrypt)
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error changing password:", error);
    // Handle common errors with Arabic messages
    if (
      error.message?.includes("Invalid") ||
      error.message?.includes("password")
    ) {
      throw new Error("كلمة المرور الحالية غير صحيحة");
    }
    throw new Error(error.message || "فشل في تغيير كلمة المرور");
  }
}

export async function updateProfileImage(imageKey: string) {
  const user = await requireUser();

  // Construct the full URL using Tigris storage format
  const imageUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${imageKey}`;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: imageUrl,
    },
  });

  revalidatePath("/dashboard/profile");

  return { success: true };
}
