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
  phone: z.string().min(9, {
    message: "رقم الجوال يجب أن يكون 9 أرقام على الأقل",
  }),
  image: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
