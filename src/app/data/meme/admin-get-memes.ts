"use server";

import prisma from "@/lib/db";
import { requireAdmin } from "../admin/require-admin";

export async function adminGetMemes(page: number = 1, limit: number = 12) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const [memes, total] = await Promise.all([
    prisma.meme.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.meme.count(),
  ]);

  return {
    memes,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
