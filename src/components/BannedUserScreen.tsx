"use client";

import { useLanguage } from "@/providers/LanguageContext";
import { IconBan } from "@tabler/icons-react";

interface BannedUserScreenProps {
  banReason?: string | null;
}

export function BannedUserScreen({ banReason }: BannedUserScreenProps) {
  const { t, language } = useLanguage();

  return (
    <div className="dark:to-background flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-red-50 to-white px-4 dark:from-red-950/20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <IconBan className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-red-600 dark:text-red-400">
          {language === "ar" ? "تم حظر حسابك" : "Account Suspended"}
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {language === "ar"
            ? "عذراً، تم حظر حسابك من الوصول إلى منصة سبايدر التعليمية. لم يعد بإمكانك الوصول إلى الدورات والمحتوى التعليمي."
            : "Sorry, your account has been suspended from Spider Educational Platform. You can no longer access courses and educational content."}
        </p>

        {banReason && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="mb-1 text-sm font-medium text-red-700 dark:text-red-300">
              {language === "ar" ? "سبب الحظر:" : "Reason:"}
            </p>
            <p className="text-red-600 dark:text-red-400">{banReason}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-500">
          {language === "ar"
            ? "إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم."
            : "If you believe this is an error, please contact support."}
        </p>
      </div>
    </div>
  );
}
