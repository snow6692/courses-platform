"use server";

import prisma from "@/lib/db";

export async function debugUserAccounts(phoneNumber: string) {
  // Find user by phone number
  const user = await prisma.user.findFirst({
    where: { phoneNumber },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    return { error: "User not found", phoneNumber };
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    },
    accounts: user.accounts.map((acc) => ({
      id: acc.id,
      accountId: acc.accountId,
      providerId: acc.providerId,
      hasPassword: !!acc.password,
      passwordLength: acc.password?.length || 0,
    })),
  };
}
