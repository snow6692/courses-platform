"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "better-auth";

//Server
export async function getAuthUser(): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}
