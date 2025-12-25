 "use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Set password for a user who registered via phone number.
 * Uses better-auth's internal password hashing (scrypt).
 */
export async function setUserPassword(password: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Use better-auth's setPassword API which handles hashing correctly
    await auth.api.setPassword({
      body: {
        newPassword: password,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error setting password:", error);
    throw new Error(error.message || "Failed to set password");
  }
}
