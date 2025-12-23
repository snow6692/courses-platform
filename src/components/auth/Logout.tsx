"use client";

import React from "react";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageContext";

function Logout() {
  const { t } = useLanguage();
  const [logoutPending, startTransition] = useTransition();
  const router = useRouter();

  async function signOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success(t("common.signed_out_success"));
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
          <span>{t("common.logout")}</span>
        </DropdownMenuItem>
      }
      title={t("common.logout")}
      description={t("common.logout_confirm")}
      onConfirm={signOut}
      confirmLabel={t("common.logout")}
      cancelLabel={t("common.cancel")}
      confirmVariant="destructive"
    />
  );
}

export default Logout;
