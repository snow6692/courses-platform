"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
}

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.id) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/profile/me");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // Fallback to session data
          setUserData({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || null,
            role: session.user.role || null,
          });
        }
      } catch (error) {
        // Fallback to session data
        setUserData({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image || null,
          role: session.user.role || null,
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (!isPending) {
      fetchUserData();
    }
  }, [session, isPending]);

  return { user: userData, isLoading: isPending || isLoading };
}
