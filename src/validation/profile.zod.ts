import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "الاسم الأول يجب أن يكون حرفين على الأقل",
  }),
  lastName: z.string().min(2, {
    message: "الاسم الأخير يجب أن يكون حرفين على الأقل",
  }),
  email: z.string().email({
    message: "البريد الإلكتروني غير صالح",
  }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 9, {
      message: "رقم الجوال يجب أن يكون 9 أرقام على الأقل",
    }),
  image: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password schemas
export const addPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "كلمة المرور الحالية مطلوبة" }),
    newPassword: z
      .string()
      .min(8, { message: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type AddPasswordValues = z.infer<typeof addPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
