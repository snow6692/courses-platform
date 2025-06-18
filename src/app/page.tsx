"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  async function signOut() {
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
  }
  return (
    <div className="text-red-500">
      {session ? (
        <p>{user?.name}</p>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
      {session && (
        <Button
          className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
          onClick={signOut}
        >
          {" "}
          Logout
        </Button>
      )}
    </div>
  );
}
