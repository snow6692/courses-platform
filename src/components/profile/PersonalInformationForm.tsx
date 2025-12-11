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
  profileFormSchema,
  ProfileFormValues,
} from "@/components/profile/profile-schema";
import { updateUser } from "@/app/actions/user.actions";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

// Default values can be passed as props
interface PersonalInformationFormProps {
  defaultValues?: Partial<ProfileFormValues>;
}

export function PersonalInformationForm({
  defaultValues,
}: PersonalInformationFormProps) {
  const [isPending, startTransition] = useTransition();

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
        await updateUser(data);
        toast.success("تم حفظ التغييرات بنجاح");
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ ما");
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
        <h2 className="mb-6 text-2xl font-bold">المعلومات الشخصية</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الاول</FormLabel>
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
                <FormLabel>الاسم الاخير</FormLabel>
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
              <FormLabel>البريد الألكتروني</FormLabel>
              <FormControl>
                <Input
                  placeholder="ahmad@example.com"
                  {...field}
                  className="text-right"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الجوال</FormLabel>
              <FormControl>
                <Input
                  placeholder="+966 50 123 4567"
                  {...field}
                  className="text-right"
                  dir="ltr"
                />
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
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </Form>
  );
}
