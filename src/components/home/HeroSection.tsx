"use client";
import { useLanguage } from "@/providers/LanguageContext";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

export function HeroSection({
  coursesCount,
  usersCount,
}: {
  usersCount: number;
  coursesCount: number;
}) {
  const { t, dir } = useLanguage();

  return (
    <section className="bg-bg-hero relative min-h-[85vh] w-full overflow-hidden px-6 py-12 md:px-12 lg:px-24">
      <div className="container mx-auto grid h-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Text Content */}
        <div className="flex flex-col items-start space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="text-foreground text-sm font-medium">
              {t("hero.badge")}
            </span>
            <span className="bg-primary mx-2 h-2 w-2 rounded-full"></span>
          </div>

          {/* Title */}
          <h1 className="text-foreground text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
            {t("hero.title")}
            <br />
            <span className="text-primary relative inline-block">
              {t("hero.highlight")}
              {/* Underline decoration */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-blue-200 opacity-50"
                />
              </svg>
            </span>
            <br />
            {t("hero.sub_highlight")}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground max-w-xl text-lg font-semibold md:text-xl">
            {t("hero.description")}
          </p>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg font-semibold text-white"
            >
              {t("hero.subscribe")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-foreground hover:bg-primary/5 px-8 py-6 text-lg font-semibold"
            >
              {t("hero.browse")}
            </Button>
          </div>

          {/* Stats */}
          <div className="border-border mt-8 flex w-full items-center justify-between border-t pt-8 sm:w-auto sm:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-foreground text-2xl font-bold">
                {usersCount}
              </span>
              <span className="text-muted-foreground text-sm">
                {t("hero.stats.students")}
              </span>
            </div>
            <div className="bg-border h-10 w-px"></div>
            <div className="flex flex-col items-center">
              <span className="text-foreground text-2xl font-bold">
                {coursesCount}
              </span>
              <span className="text-muted-foreground text-sm">
                {t("hero.stats.courses")}
              </span>
            </div>
            <div className="bg-border h-10 w-px"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <span className="text-foreground text-2xl font-bold">
                  {t("hero.stats.rating")}
                </span>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="relative flex h-full min-h-[400px] w-full items-center justify-center lg:min-h-[600px]">
          {/* Decorative elements */}
          <div className="border-primary absolute top-10 left-10 h-12 w-12 rotate-12 rounded-xl border-4 opacity-80"></div>
          <div className="bg-primary absolute right-10 bottom-20 h-8 w-8 rounded-full opacity-20"></div>
          <div className="absolute top-20 right-20 h-6 w-6 rounded-full bg-yellow-400 opacity-60"></div>

          {/* Main Illustration */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <Image
              src="/images/hero.svg"
              alt={t("hero.title")}
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
