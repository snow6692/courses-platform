import React from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
function Logout() {
  const [logoutPending, startTransition] = useTransition();
  const router = useRouter();

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
    <ConfirmDialog
      trigger={
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // Prevent menu from closing
          className="flex cursor-pointer items-center gap-2"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      }
      title="Logout"
      description="Are you sure you want to logout?"
      onConfirm={signOut}
      confirmLabel="Logout"
      cancelLabel="Cancel"
      confirmVariant="destructive"
    />
  );
}

export default Logout;
