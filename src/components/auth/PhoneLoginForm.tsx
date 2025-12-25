"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageContext";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { PhoneInput } from "@/components/ui/phone-input";

interface PhoneLoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
}

export function PhoneLoginForm({
  onForgotPassword,
  onRegister,
}: PhoneLoginFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validate phone starts with + and has country code
  const isPhoneValid = phone.startsWith("+") && phone.length >= 10;

  function signInWithPhone() {
    startTransition(async () => {
      const { data, error } = await authClient.signIn.phoneNumber({
        phoneNumber: phone,
        password,
        rememberMe: true,
      });

      if (error) {
        // Map error messages to translated ones
        const errorMessage = error.message?.toLowerCase() || "";

        if (
          errorMessage.includes("invalid") &&
          errorMessage.includes("password")
        ) {
          toast.error(t("phone_auth.invalid_credentials"));
        } else if (
          errorMessage.includes("invalid") &&
          errorMessage.includes("email")
        ) {
          toast.error(t("phone_auth.invalid_credentials"));
        } else if (
          errorMessage.includes("not found") ||
          errorMessage.includes("user")
        ) {
          toast.error(t("phone_auth.user_not_found"));
        } else {
          toast.error(t("phone_auth.login_failed"));
        }
        return;
      }

      if (data) {
        toast.success(t("phone_auth.login_success"));
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="phone">{t("phone_auth.phone_label")}</Label>
        <PhoneInput
          value={phone}
          onChange={(value) => setPhone(value)}
          placeholder="501234567"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("phone_auth.password_label")}</Label>
        <div className="relative">
          <IconLock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            {showPassword ? (
              <IconEyeOff className="size-4" />
            ) : (
              <IconEye className="size-4" />
            )}
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary text-sm hover:underline"
        >
          {t("phone_auth.forgot_password")}
        </button>
      </div>
      <Button
        onClick={signInWithPhone}
        className="w-full cursor-pointer font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending || !isPhoneValid || !password}
      >
        {isPending ? t("phone_auth.signing_in") : t("phone_auth.sign_in")}
      </Button>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {t("phone_auth.no_account")}{" "}
        </span>
        <button
          type="button"
          onClick={onRegister}
          className="text-primary font-medium hover:underline"
        >
          {t("phone_auth.register_now")}
        </button>
      </div>
    </div>
  );
}
