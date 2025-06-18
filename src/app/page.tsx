"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function signOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success("Signed out successfully");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  return (
    <div className="text-red-500">
      {session ? (
        <p>{user?.name}</p>
      ) : (
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      )}
      {session && (
        <ConfirmDialog
          trigger={
            <Button
              className="cursor-pointer bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Logging out..." : "Logout"}
            </Button>
          }
          title="Confirm Logout"
          description="Are you sure you want to log out of your account?"
          confirmLabel="Logout"
          cancelLabel="Cancel"
          onConfirm={signOut}
          confirmVariant="destructive"
        />
      )}
    </div>
  );
}
