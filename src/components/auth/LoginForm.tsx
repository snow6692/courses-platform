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
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useLanguage } from "@/providers/LanguageContext";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useQueryState("email", { defaultValue: "" });

  function signInWithGoogle() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success(t("login_page.signed_in_google"));
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
            toast.success(t("login_page.verification_sent"));
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
    <Card className="border-border/50 space-y-5 shadow-xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">
            {t("login_page.welcome_back")}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {t("login_page.login_methods_desc")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={signInWithGoogle}
          className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
        >
          <IconBrandGoogle className="size-4" />
          {t("login_page.sign_in_google")}
        </Button>

        <div className="my-4 flex items-center justify-center">
          <div className="border-border w-1/4 border-t" />
          <span className="bg-card text-muted-foreground px-2 text-sm">
            {t("login_page.or_continue_with")}
          </span>
          <div className="border-border w-1/4 border-t" />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t("login_page.email_label")}</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder={"test123@gmail.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={signInWithEmail}
            className="w-full cursor-pointer font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending || !email}
          >
            {t("login_page.continue_email")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
