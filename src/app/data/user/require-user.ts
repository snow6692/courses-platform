import "server-only";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { cache } from "react";

// Cached function to get current user - no redirect, returns null if not logged in
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Get fresh user data from database (includes updated image)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  return user;
});

// For pages that require authentication - redirects to login
export async function requireUser() {
  const { redirect } = await import("next/navigation");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  // Get fresh user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      phone: true,
    },
  });

  if (!user) {
    return redirect("/login");
  }

  return user;
}

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;
export type RequiredUser = Awaited<ReturnType<typeof requireUser>>;
