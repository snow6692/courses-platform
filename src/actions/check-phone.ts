"use server";

import prisma from "@/lib/db";

/**
 * Check if a phone number is already in use by another user.
 * Returns true if phone is available, false if already taken.
 */
export async function checkPhoneAvailable(
  phoneNumber: string,
): Promise<boolean> {
  const existingUser = await prisma.user.findFirst({
    where: { phoneNumber },
  });

  return !existingUser;
}
