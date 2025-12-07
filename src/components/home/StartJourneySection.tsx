"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";

export function StartJourneySection() {
  const { t } = useLanguage();

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-6">
        <div className="bg-bg-hero relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[3rem] p-12 text-center md:min-h-[400px]">
          {/* Decorations */}
          {/* Square/Diamond shape left */}
          <div className="border-primary absolute top-20 left-10 h-16 w-16 rotate-12 rounded-2xl border-4 opacity-30 md:left-20" />
          <div className="absolute top-24 left-32 h-8 w-8 rounded-full bg-yellow-200 opacity-50" />

          {/* Book Icon Right */}
          <div className="absolute right-4 bottom-4 h-32 w-32 md:right-20 md:bottom-10 md:h-48 md:w-48">
            <Image
              src="/images/book.svg"
              alt="Book"
              fill
              className="object-contain opacity-90"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-foreground text-3xl leading-tight font-extrabold md:text-5xl">
              {t("home.start_journey.title")}
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              {t("home.start_journey.description")}
            </p>
            <Button
              size="lg"
              className="mt-4 bg-[#D32F2F] px-8 text-lg font-bold text-white shadow-lg hover:bg-[#B71C1C]"
            >
              {t("home.start_journey.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
