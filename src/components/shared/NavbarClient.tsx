"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import UserDropDown from "../auth/UserDropDown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageContext";

interface NavbarClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
  } | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const { t } = useLanguage();

  const navItems = [
    {
      label: t("navbar.home"),
      href: "/",
    },
    {
      label: t("navbar.courses"),
      href: "/courses",
    },
    {
      label: t("navbar.dashboard"),
      href: "/dashboard",
    },
  ];

  return (
    <header className="border-border/40 bg-background/60 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="size-9 rounded-full transition-all duration-[3000] hover:animate-spin"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-6 ltr:ml-6 rtl:mr-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground text-sm font-medium",
                  isActive(item.href) && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link href={"/dashboard"}>
                  <Button>{t("navbar.dashboard")}</Button>
                </Link>

                <UserDropDown
                  email={user.email}
                  name={user.name}
                  image={user.image ?? ""}
                  role={user.role ?? "user"}
                />
              </>
            ) : (
              <>
                <Link href={"/login"}>{t("navbar.login")}</Link>
                <Link
                  href={"/login"}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t("navbar.get_started")}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
