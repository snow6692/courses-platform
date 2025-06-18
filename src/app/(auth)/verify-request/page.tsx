"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

function VerifyRequestPage() {
  const [otp, setOtp] = useState("");
  const [emailPending, startEmailTransition] = useTransition();
  const [email] = useQueryState("email", { defaultValue: "" });
  const router = useRouter();
  function verifyAccount() {
    startEmailTransition(async () => {
      if (!email) {
        toast.error("Email is required");
        return;
      }
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account verified successfully");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          OTP has been sent to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSeparator />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-muted-foreground my-4 text-sm">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>
        <Button
          className="w-full disabled:opacity-50"
          onClick={verifyAccount}
          disabled={emailPending || otp.length !== 6}
        >
          {emailPending ? "Verifying..." : "Verify Account"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default VerifyRequestPage;
