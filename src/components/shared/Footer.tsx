"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Youtube, Instagram, Twitter } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative w-full border-t bg-white pt-16 pb-8">
      {/* Background Watermark */}
      <div className="absolute inset-0 bg-[url('/images/footer.svg')] bg-[length:600px_600px] bg-center bg-no-repeat opacity-[0.03]" />

      <div className="relative container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-2 lg:grid-cols-4 lg:text-start">
          {/* Column 1: Logo & Slogan */}
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            <p className="text-muted-foreground max-w-xs text-center font-medium lg:text-start">
              {t("footer.slogan")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-foreground text-lg font-bold">
              {t("footer.links.title")}
            </h3>
            <div className="text-muted-foreground flex flex-col gap-3 text-sm">
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.links.about")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.links.terms")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.links.privacy")}
              </Link>
            </div>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-foreground text-lg font-bold">
              {t("footer.support.title")}
            </h3>
            <div className="text-muted-foreground flex flex-col gap-3 text-sm">
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.support.help_center")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.support.contact")}
              </Link>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col gap-4">
            <h3 className="text-foreground text-lg font-bold">
              {t("footer.follow.title")}
            </h3>
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-[#FF0000]"
              >
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-[#E1306C]"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-[#1DA1F2]"
              >
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
