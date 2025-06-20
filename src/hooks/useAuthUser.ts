import { authClient } from "@/lib/auth-client";

//Client
export function useSession() {
  const { data: session, isPending } = authClient.useSession();

  return { session: { user: session?.user ?? null }, isPending } as const;
}
