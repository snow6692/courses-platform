"use client";

import React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export function LearnYourWaySection() {
  const { t, dir } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24">
      {/* Web Decorator */}

      <div className="absolute top-0 right-0 h-96 w-96 bg-[url('/images/web.svg')] bg-contain bg-right-top bg-no-repeat opacity-50" />

      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Image Side */}
        <div className="relative flex min-h-[400px] w-full items-center justify-center lg:min-h-[500px]">
          <Image
            src="/images/section3.svg"
            alt="Learn your way"
            fill
            className="object-contain"
          />
        </div>

        {/* Text Side */}
        <div className="flex flex-col items-start space-y-6">
          <h2 className="text-3xl leading-tight font-bold md:text-5xl">
            <span className="text-foreground">
              {t("home.learn_your_way.title_part1")}
            </span>
            <br />
            <span className="text-foreground">
              {t("home.learn_your_way.title_part2")}{" "}
            </span>
            <span className="text-primary relative inline-block">
              {t("home.learn_your_way.highlight")}
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
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
            {t("home.learn_your_way.description")}
          </p>

          <Link
            href={"/courses"}
            className={buttonVariants({
              size: "lg",
              className:
                "bg-primary hover:bg-primary/90 min-w-[200px] text-lg font-bold text-white shadow-lg shadow-red-500/20",
            })}
          >
            <span>{t("home.learn_your_way.button")}</span>
            <MoveLeft
              className={`ml-2 h-5 w-5 transition-transform duration-300 ${
                dir === "rtl"
                  ? "group-hover:-translate-x-1"
                  : "rotate-180 group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
