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
  IconUser,
} from "@tabler/icons-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/phone-input";

interface PhoneRegisterFormProps {
  onBack: () => void;
}

export function PhoneRegisterForm({ onBack }: PhoneRegisterFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validate phone starts with + and has country code
  const isPhoneValid = phone.startsWith("+") && phone.length >= 10;
  const isFormValid =
    isPhoneValid &&
    firstName.trim() &&
    lastName.trim() &&
    password &&
    confirmPassword;

  function sendOTP() {
    if (password !== confirmPassword) {
      toast.error(t("phone_auth.password_mismatch"));
      return;
    }

    if (password.length < 8) {
      toast.error(t("phone_auth.password_min_length"));
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast.error(t("phone_auth.name_required"));
      return;
    }

    startTransition(async () => {
      const { data, error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });

      if (error) {
        // Check if error is about invalid phone number (means it's already in use)
        if (
          error.message?.toLowerCase().includes("invalid") ||
          error.code === "INVALID_PHONE_NUMBER"
        ) {
          toast.error(t("phone_auth.phone_already_in_use"));
        } else {
          toast.error(error.message || t("phone_auth.otp_send_failed"));
        }
        return;
      }

      if (data) {
        toast.success(t("phone_auth.otp_sent"));
        setStep("otp");
      }
    });
  }

  function verifyOTP() {
    startTransition(async () => {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: otp,
      });

      if (error) {
        toast.error(error.message || t("phone_auth.otp_verify_failed"));
        return;
      }

      if (data) {
        try {
          // Update user name after verification
          await authClient.updateUser({
            name: `${firstName.trim()} ${lastName.trim()}`,
          });

          // Save the password for the new account using better-auth's API
          const { setUserPassword } = await import("@/actions/set-password");
          await setUserPassword(password);

          toast.success(t("phone_auth.register_success"));
          window.location.href = "/";
        } catch (err: any) {
          toast.error(err.message || t("phone_auth.setup_error"));
        }
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
        <Button
          onClick={verifyOTP}
          className="w-full cursor-pointer font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending || otp.length !== 6}
        >
          {isPending ? t("phone_auth.verifying") : t("phone_auth.verify_otp")}
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

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="firstName">{t("phone_auth.first_name")}</Label>
          <div className="relative">
            <IconUser className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="firstName"
              type="text"
              required
              placeholder={t("phone_auth.first_name_placeholder")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">{t("phone_auth.last_name")}</Label>
          <div className="relative">
            <IconUser className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="lastName"
              type="text"
              required
              placeholder={t("phone_auth.last_name_placeholder")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

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
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">
          {t("phone_auth.confirm_password")}
        </Label>
        <div className="relative">
          <IconLock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="confirmPassword"
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
        onClick={sendOTP}
        className="w-full cursor-pointer font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending || !isFormValid}
      >
        {isPending ? t("phone_auth.sending_otp") : t("phone_auth.send_otp")}
      </Button>
    </div>
  );
}
