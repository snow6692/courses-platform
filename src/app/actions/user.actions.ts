"use server";

import prisma from "@/lib/db";
import { profileFormSchema, ProfileFormValues } from "@/validation/profile.zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "../data/user/require-user";
import bcrypt from "bcryptjs";
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
  if (rest.phone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: rest.phone,
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
      phone: result.data.phone || null,
    },
  });

  revalidatePath("/dashboard/profile");

  return { success: true };
}

export async function addPassword(password: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Check if user already has a credential account
  const existingAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential",
    },
  });

  if (existingAccount && existingAccount.password) {
    throw new Error("لديك كلمة مرور بالفعل");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingAccount) {
    // Update existing credential account
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { password: hashedPassword },
    });
  } else {
    // Create new credential account
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: session.user.id,
        providerId: "credential",
        userId: session.user.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

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

  // Get current password hash
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential",
    },
  });

  if (!account || !account.password) {
    throw new Error("لا يوجد كلمة مرور لتغييرها");
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, account.password);

  if (!isValid) {
    throw new Error("كلمة المرور الحالية غير صحيحة");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.account.update({
    where: { id: account.id },
    data: { password: hashedPassword },
  });

  revalidatePath("/dashboard/profile");

  return { success: true };
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
