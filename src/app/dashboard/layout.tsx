import Navbar from "@/components/shared/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { BannedUserScreen } from "@/components/BannedUserScreen";
import React, { ReactNode } from "react";

async function DashboardLayout({ children }: { children: ReactNode }) {
  // Check if user is banned
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { banned: true, banReason: true },
    });

    if (user?.banned) {
      return <BannedUserScreen banReason={user.banReason} />;
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
