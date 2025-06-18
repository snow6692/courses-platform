"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  function signInWithGoogle() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google successfully");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification code sent to email");
            router.push(`/verify-request/?email=${email}`);
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back! </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Login With Google or Email Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={signInWithGoogle}
          className="w-full disabled:opacity-50"
          variant="outline"
          disabled={isPending}
        >
          <FcGoogle className="size-4" />
          Sign in with Google
        </Button>

        <div className="my-4 flex items-center justify-center">
          <div className="border-border w-1/4 border-t" />
          <span className="bg-background text-muted-foreground px-2 text-sm">
            Or Continue With
          </span>
          <div className="border-border w-1/4 border-t" />
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="snow@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={signInWithEmail}
            className="w-full disabled:opacity-50"
            disabled={isPending || !email}
          >
            Continue With Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
