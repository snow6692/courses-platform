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
import { profileFormSchema, ProfileFormValues } from "@/validation/profile.zod";
import { updateUser } from "@/app/actions/user.actions";
import { useTransition } from "react";
import { Loader2, Lock } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";
import { PhoneInput } from "@/components/ui/phone-input";

interface PersonalInformationFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  isGoogleUser?: boolean;
}

export function PersonalInformationForm({
  defaultValues,
  isGoogleUser = false,
}: PersonalInformationFormProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      try {
        await updateUser(data, isGoogleUser);
        toast.success(t("profile.personal.save_success"));
      } catch (error: any) {
        toast.error(error.message || t("profile.personal.save_error"));
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 text-right"
        dir="rtl"
      >
        <h2 className="mb-6 text-2xl font-bold">
          {t("profile.personal.title")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.personal.first_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="أحمد" {...field} className="text-right" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.personal.last_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="العتيبي"
                    {...field}
                    className="text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                {t("profile.personal.email")}
                {isGoogleUser && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    {t("profile.personal.google_account")}
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ahmad@example.com"
                  {...field}
                  className="text-right"
                  disabled={isGoogleUser}
                />
              </FormControl>
              {isGoogleUser && (
                <p className="text-xs text-gray-500">
                  {t("profile.personal.google_email_locked")}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("profile.personal.phone")}{" "}
                <span className="text-gray-500">
                  {t("profile.personal.phone_optional")}
                </span>
              </FormLabel>
              <FormControl>
                <PhoneInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-[150px] bg-red-600 text-white hover:bg-red-700"
          >
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {t("profile.personal.save_changes")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
