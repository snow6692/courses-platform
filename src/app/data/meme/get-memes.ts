"use server";

import prisma from "@/lib/db";

export async function getGlobalMemes() {
  const memes = await prisma.meme.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return memes;
}
