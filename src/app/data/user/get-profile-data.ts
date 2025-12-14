"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getProfileData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const userId = session.user.id;

  // Get user with accounts to check auth provider
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      createdAt: true,
      accounts: {
        select: {
          providerId: true,
          password: true,
        },
      },
    },
  });

  if (!user) {
    return redirect("/login");
  }

  // Check if user has Google account
  const hasGoogleAccount = user.accounts.some(
    (account) => account.providerId === "google",
  );

  // Check if user has password (credential account)
  const hasPassword = user.accounts.some(
    (account) => account.providerId === "credential" && account.password,
  );

  // Get enrollments with course info
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      status: "SUCCESSFUL",
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      Course: {
        select: {
          id: true,
          title: true,
          slug: true,
          fileKey: true,
          level: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate metrics
  const coursesCount = enrollments.length;
  const totalHours = await prisma.course.aggregate({
    where: {
      enrollments: {
        some: {
          userId,
          status: "SUCCESSFUL",
        },
      },
    },
    _sum: {
      duration: true,
    },
  });

  return {
    user: {
      ...user,
      firstName: user.name.split(" ")[0] || "",
      lastName: user.name.split(" ").slice(1).join(" ") || "",
    },
    hasGoogleAccount,
    hasPassword,
    enrollments,
    metrics: {
      courses: coursesCount,
      hours: totalHours._sum.duration || 0,
    },
  };
}

export type ProfileData = Awaited<ReturnType<typeof getProfileData>>;
