"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageContext";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { IconArrowLeft } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

interface PhoneChangeDialogProps {
  currentPhone: string;
  onPhoneChanged: (newPhone: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhoneChangeDialog({
  currentPhone,
  onPhoneChanged,
  open,
  onOpenChange,
}: PhoneChangeDialogProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"input" | "otp">("input");
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Validate phone starts with + and has country code
  const isPhoneValid = newPhone.startsWith("+") && newPhone.length >= 10;
  const isNewPhoneDifferent = newPhone !== currentPhone;

  function handleClose() {
    setStep("input");
    setNewPhone("");
    setOtp("");
    onOpenChange(false);
  }

  function sendOTP() {
    if (!isPhoneValid || !isNewPhoneDifferent) return;

    startTransition(async () => {
      try {
        // Check if phone number is already in use
        const { checkPhoneAvailable } = await import("@/actions/check-phone");
        const isAvailable = await checkPhoneAvailable(newPhone);

        if (!isAvailable) {
          toast.error(t("profile.phone_change.phone_in_use"));
          return;
        }

        // Use phoneNumber plugin to send OTP to the new number
        const { error } = await authClient.phoneNumber.sendOtp({
          phoneNumber: newPhone,
        });

        if (error) {
          toast.error(
            error.message || t("profile.phone_change.otp_send_failed"),
          );
          return;
        }

        toast.success(t("profile.phone_change.otp_sent"));
        setStep("otp");
      } catch (err: any) {
        toast.error(err.message || t("profile.phone_change.otp_send_failed"));
      }
    });
  }

  function verifyOTP() {
    if (otp.length !== 6) return;

    startTransition(async () => {
      try {
        // Verify the OTP
        const { error } = await authClient.phoneNumber.verify({
          phoneNumber: newPhone,
          code: otp,
          updatePhoneNumber: true, // This tells better-auth to update the phone number
        });

        if (error) {
          toast.error(
            error.message || t("profile.phone_change.otp_verify_failed"),
          );
          return;
        }

        toast.success(t("profile.phone_change.success"));
        onPhoneChanged(newPhone);
        handleClose();
      } catch (err: any) {
        toast.error(err.message || t("profile.phone_change.otp_verify_failed"));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("profile.phone_change.title")}</DialogTitle>
          <DialogDescription>
            {step === "input"
              ? t("profile.phone_change.description")
              : t("profile.phone_change.otp_description")}
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="space-y-4">
            {currentPhone && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-sm">
                  {t("profile.phone_change.current_phone")}
                </p>
                <p className="font-medium" dir="ltr">
                  {currentPhone}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>{t("profile.phone_change.new_phone")}</Label>
              <PhoneInput
                value={newPhone}
                onChange={setNewPhone}
                placeholder="501234567"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("profile.phone_change.cancel")}
              </Button>
              <Button
                onClick={sendOTP}
                disabled={isPending || !isPhoneValid || !isNewPhoneDifferent}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("profile.phone_change.send_otp")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep("input")}
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
                {newPhone}
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
              className="w-full"
              disabled={isPending || otp.length !== 6}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("profile.phone_change.verify_and_save")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
