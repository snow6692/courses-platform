"use client";
import { useLanguage } from "@/providers/LanguageContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection({
  coursesCount,
  usersCount,
}: {
  usersCount: number;
  coursesCount: number;
}) {
  const { t } = useLanguage();

  return (
    <section className="bg-bg-hero relative min-h-[120vh] w-full overflow-hidden pt-20 lg:pt-0">
      <div className="container mx-auto grid h-full min-h-[90vh] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Text Content */}
        <div className="flex flex-col items-start space-y-8 py-12 lg:py-0">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="text-foreground text-sm font-medium">
              {t("hero.badge")}
            </span>
            <span className="bg-primary mx-2 h-2 w-2 rounded-full"></span>
          </div>

          {/* Title */}
          <h1 className="text-foreground text-5xl leading-tight font-extrabold md:text-6xl lg:text-7xl">
            {t("hero.title")}
            <br />
            <span className="text-primary relative mt-2 inline-block">
              {t("hero.highlight")}
              {/* Underline decoration */}
              <svg
                className="absolute right-0 -bottom-2 w-full"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-blue-200/50"
                />
              </svg>
            </span>
            <br />
            {t("hero.sub_highlight")}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground max-w-lg text-lg leading-relaxed font-medium md:text-xl">
            {t("hero.description")}
          </p>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Link
              href={"/login"}
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-primary hover:bg-primary/90 min-w-[200px] text-lg font-bold text-white shadow-lg shadow-red-500/20",
              })}
            >
              {t("hero.subscribe")}
            </Link>
            <Link
              href={"/courses"}
              className={buttonVariants({
                size: "lg",
                className:
                  "border-primary min-w-[200px] border-2 bg-transparent text-lg font-bold text-[black!important] hover:bg-red-50",
              })}
            >
              {t("hero.browse")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
            <div className="flex items-center justify-between gap-8 border-t pt-8 sm:justify-start sm:border-t-0 sm:pt-0">
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold text-black">
                  {usersCount}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {t("hero.stats.students")}
                </span>
              </div>
              <div className="bg-border h-12 w-px"></div>
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold text-black">
                  {coursesCount}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {t("hero.stats.courses")}
                </span>
              </div>
              <div className="bg-border h-12 w-px"></div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold text-black">
                    {t("hero.stats.rating")}
                  </span>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star
                      key={i}
                      className="text-muted-foreground/30 h-3 w-3 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="relative flex h-full min-h-[500px] w-full items-center justify-center lg:min-h-[700px]">
          <div className="relative z-10 h-full w-full">
            <Image
              src="/images/hero.svg"
              alt={t("hero.title")}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block h-[30px] w-[calc(100%+1.3px)] sm:h-[60px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,432.84,52.47,276.53,60.83,109.25,32.38,32,0L0,0V120H1200V75.1C1154.27,99.37,1065.19,113.67,985.66,92.83Z"
            className="fill-background"
          ></path>
        </svg>
      </div>
    </section>
  );
}
