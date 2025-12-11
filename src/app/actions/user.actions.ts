"use server";

import prisma from "@/lib/db";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/components/profile/profile-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUser(data: ProfileFormValues) {
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

  // Check if email is already taken by another user
  if (rest.email && rest.email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: rest.email,
      },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: fullName,
      email: result.data.email,
      // Update other fields as needed, e.g., phone if your DB schema has it
      // phone: result.data.phone
    },
  });

  revalidatePath("/dashboard/profile");

  return { success: true };
}
