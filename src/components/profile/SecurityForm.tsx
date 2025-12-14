"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  addPasswordSchema,
  AddPasswordValues,
  changePasswordSchema,
  ChangePasswordValues,
} from "@/validation/profile.zod";
import { useTransition } from "react";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { addPassword, changePassword } from "@/app/actions/user.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/providers/LanguageContext";

interface SecurityFormProps {
  hasPassword: boolean;
}

export function SecurityForm({ hasPassword }: SecurityFormProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const addPasswordForm = useForm<AddPasswordValues>({
    resolver: zodResolver(addPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const changePasswordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onAddPassword(data: AddPasswordValues) {
    startTransition(async () => {
      try {
        await addPassword(data.password);
        toast.success(t("profile.security.add_success"));
        addPasswordForm.reset();
      } catch (error: any) {
        toast.error(error.message || t("profile.personal.save_error"));
      }
    });
  }

  function onChangePassword(data: ChangePasswordValues) {
    startTransition(async () => {
      try {
        await changePassword(data.currentPassword, data.newPassword);
        toast.success(t("profile.security.change_success"));
        changePasswordForm.reset();
      } catch (error: any) {
        toast.error(error.message || t("profile.personal.save_error"));
      }
    });
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <h2 className="mb-6 text-2xl font-bold">
        {hasPassword
          ? t("profile.security.change_password_title")
          : t("profile.security.add_password_title")}
      </h2>

      {hasPassword ? (
        <Form {...changePasswordForm}>
          <form
            onSubmit={changePasswordForm.handleSubmit(onChangePassword)}
            className="space-y-6"
          >
            <FormField
              control={changePasswordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("profile.security.current_password")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="password"
                        {...field}
                        className="pr-10 text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={changePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.security.new_password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="password"
                        {...field}
                        className="pr-10 text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={changePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("profile.security.confirm_password")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="password"
                        {...field}
                        className="pr-10 text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordHints />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[150px] bg-red-600 text-white hover:bg-red-700"
              >
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {t("profile.security.save_changes")}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...addPasswordForm}>
          <form
            onSubmit={addPasswordForm.handleSubmit(onAddPassword)}
            className="space-y-6"
          >
            <FormField
              control={addPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.security.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="password"
                        {...field}
                        className="pr-10 text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("profile.security.confirm_password")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="password"
                        {...field}
                        className="pr-10 text-right"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordHints />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[150px] bg-red-600 text-white hover:bg-red-700"
              >
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {t("profile.security.save_changes")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

function PasswordHints() {
  const { t } = useLanguage();

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
          <li>{t("profile.security.password_hints.min_length")}</li>
          <li>{t("profile.security.password_hints.mix_chars")}</li>
          <li>{t("profile.security.password_hints.no_personal")}</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
