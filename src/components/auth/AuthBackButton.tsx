"use client";

import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AuthBackButton() {
  const { t, dir } = useLanguage();

  return (
    <div className="absolute top-10 left-4 z-50 rtl:right-4 rtl:left-auto">
      <Link
        href={"/"}
        className={cn(
          buttonVariants({
            variant: "outline",
            className:
              "bg-background/50 hover:bg-background/80 gap-2 backdrop-blur-sm",
          }),
        )}
      >
        {dir === "rtl" ? (
          <ArrowRight className="size-4" />
        ) : (
          <ArrowLeft className="size-4" />
        )}
        {t("common.back")}
      </Link>
    </div>
  );
}
