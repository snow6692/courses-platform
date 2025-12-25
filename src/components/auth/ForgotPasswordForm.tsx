"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageContext";
import {
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
} from "@tabler/icons-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/phone-input";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validate phone starts with + and has country code
  const isPhoneValid = phone.startsWith("+") && phone.length >= 10;

  function requestReset() {
    startTransition(async () => {
      const { data, error } = await authClient.phoneNumber.requestPasswordReset(
        {
          phoneNumber: phone,
        },
      );

      if (error) {
        toast.error(error.message || t("phone_auth.reset_request_failed"));
        return;
      }

      if (data) {
        toast.success(t("phone_auth.otp_sent"));
        setStep("otp");
      }
    });
  }

  function resetPassword() {
    if (newPassword !== confirmPassword) {
      toast.error(t("phone_auth.password_mismatch"));
      return;
    }

    if (newPassword.length < 8) {
      toast.error(t("phone_auth.password_min_length"));
      return;
    }

    startTransition(async () => {
      const { data, error } = await authClient.phoneNumber.resetPassword({
        phoneNumber: phone,
        otp,
        newPassword,
      });

      if (error) {
        toast.error(error.message || t("phone_auth.reset_failed"));
        return;
      }

      if (data) {
        toast.success(t("phone_auth.reset_success"));
        onBack();
      }
    });
  }

  if (step === "otp") {
    return (
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setStep("phone")}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
        >
          <IconArrowLeft className="size-4" />
          {t("phone_auth.back")}
        </button>
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            {t("phone_auth.otp_sent_to")}
          </p>
          <p className="font-medium" dir="ltr">
            {phone}
          </p>
        </div>
        <div className="flex justify-center" dir="ltr">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword">{t("phone_auth.new_password")}</Label>
          <div className="relative">
            <IconLock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
        <div className="grid gap-2">
          <Label htmlFor="confirmNewPassword">
            {t("phone_auth.confirm_password")}
          </Label>
          <div className="relative">
            <IconLock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="confirmNewPassword"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          onClick={resetPassword}
          className="w-full cursor-pointer font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isPending || otp.length !== 6 || !newPassword || !confirmPassword
          }
        >
          {isPending
            ? t("phone_auth.resetting")
            : t("phone_auth.reset_password")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
      >
        <IconArrowLeft className="size-4" />
        {t("phone_auth.back_to_login")}
      </button>
      <div className="text-center">
        <h3 className="text-lg font-semibold">
          {t("phone_auth.forgot_password_title")}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t("phone_auth.forgot_password_desc")}
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">{t("phone_auth.phone_label")}</Label>
        <PhoneInput
          value={phone}
          onChange={(value) => setPhone(value)}
          placeholder="501234567"
        />
      </div>
      <Button
        onClick={requestReset}
        className="w-full cursor-pointer font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending || !isPhoneValid}
      >
        {isPending ? t("phone_auth.sending_otp") : t("phone_auth.send_otp")}
      </Button>
    </div>
  );
}
