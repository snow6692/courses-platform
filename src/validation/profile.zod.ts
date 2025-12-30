import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "profile.validation.first_name_min",
  }),
  lastName: z.string().min(2, {
    message: "profile.validation.last_name_min",
  }),
  email: z.string().email({
    message: "profile.validation.email_invalid",
  }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 9, {
      message: "profile.validation.phone_min",
    }),
  image: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password schemas
export const addPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "profile.validation.password_min" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "profile.validation.password_mismatch",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "profile.validation.password_required" }),
    newPassword: z
      .string()
      .min(8, { message: "profile.validation.password_min" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "profile.validation.password_mismatch",
    path: ["confirmPassword"],
  });

export type AddPasswordValues = z.infer<typeof addPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
