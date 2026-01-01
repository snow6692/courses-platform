"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import UserDropDown from "../auth/UserDropDown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useLanguage } from "@/providers/LanguageContext";
import { useSession } from "@/hooks/useAuthUser";
import { Menu, User } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const {
    session: { user },
    isPending,
  } = useSession();

  const mobileNavItems = [
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
    <header className="border-border/40 bg-background/60 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full overflow-hidden border-b backdrop-blur-xl">
      <div className="relative z-10 container mx-auto flex min-h-16 items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        {/* Left Side - Logo + Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={"/images/logo.svg"}
              alt="logo"
              width={50}
              height={50}
              className="size-9 rounded-full transition-all duration-[3000] hover:animate-spin"
            />
          </Link>

          {/* Navigation Links - Desktop only */}
          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/courses"
              className={cn(
                "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors",
                isActive("/courses") && "text-foreground",
              )}
            >
              {t("navbar.courses")}
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors",
                    isActive("/dashboard") && "text-foreground",
                  )}
                >
                  {t("navbar.dashboard")}
                </Link>
                <Link
                  href="/dashboard/profile"
                  className={cn(
                    "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors",
                    isActive("/dashboard/profile") && "text-foreground",
                  )}
                >
                  {t("user_menu.profile")}
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Side - Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <ModeToggle />
          <LanguageSwitcher />
          {user ? (
            <UserDropDown
              email={user.email}
              name={user.name}
              image={user.image ?? ""}
              role={user.role ?? "user"}
            />
          ) : (
            <>
              <Link href={"/login"}>{t("navbar.login")}</Link>
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "default" })}
              >
                {t("navbar.get_started")}
              </Link>
            </>
          )}
        </div>

        {/* Right Side - Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <LanguageSwitcher />
          {user && (
            <UserDropDown
              email={user.email}
              name={user.name}
              image={user.image ?? ""}
              role={user.role ?? "user"}
            />
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="text-start">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={"/images/logo.svg"}
                      alt="logo"
                      width={40}
                      height={40}
                      className="size-8 rounded-full"
                    />
                    <span className="text-lg font-bold">Spider</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Menu Items */}
              <nav className="mt-8 flex flex-col gap-2">
                {mobileNavItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "hover:bg-muted flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="my-4 border-t" />

                {/* Auth Section */}
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "hover:bg-muted flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                        isActive("/dashboard/profile")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <User className="size-5" />
                      {t("user_menu.profile")}
                    </Link>

                    {/* User Info */}
                    <div className="bg-muted/50 mx-4 mt-4 flex items-center gap-3 rounded-lg p-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="size-10 rounded-full"
                        />
                      ) : (
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                          <User className="size-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 px-4">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full justify-center",
                      )}
                    >
                      {t("navbar.login")}
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center",
                      )}
                    >
                      {t("navbar.get_started")}
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
