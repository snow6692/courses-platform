import { authClient } from "@/lib/auth-client";

//Client
export function useAuthUser() {
  const { data: session } = authClient.useSession();
  return session?.user ?? null;
}
