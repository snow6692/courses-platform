"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useLanguage } from "@/providers/LanguageContext";
import Image from "next/image";
import { PhoneLoginForm } from "./PhoneLoginForm";
import { PhoneRegisterForm } from "./PhoneRegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type AuthView = "login" | "register" | "forgot-password";

// Reusable Auth Card Wrapper
function AuthCardWrapper({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center px-4">
      <Card className="border-border/50 w-full max-w-2xl space-y-4 p-6 shadow-xl sm:p-8">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          {(title || description) && (
            <div>
              {title && (
                <CardTitle className="text-2xl font-bold sm:text-3xl">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="text-muted-foreground text-sm">
                  {description}
                </CardDescription>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [authView, setAuthView] = useState<AuthView>("login");

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

  if (authView === "register") {
    return (
      <AuthCardWrapper
        title={t("phone_auth.register_title")}
        description={t("phone_auth.register_desc")}
      >
        <PhoneRegisterForm onBack={() => setAuthView("login")} />
      </AuthCardWrapper>
    );
  }

  if (authView === "forgot-password") {
    return (
      <AuthCardWrapper>
        <ForgotPasswordForm onBack={() => setAuthView("login")} />
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      title={t("login_page.welcome_back")}
      description={t("login_page.login_methods_desc")}
    >
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

      <PhoneLoginForm
        onForgotPassword={() => setAuthView("forgot-password")}
        onRegister={() => setAuthView("register")}
      />
    </AuthCardWrapper>
  );
}

export default LoginForm;
