"use client";
import Link from "next/link";
import React, { useTransition } from "react";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useAuthUser";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import UserDropDown from "./UserDropDown";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];

function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const {
    session: { user },
    isPending,
  } = useSession();

  return (
    <header className="bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex min-h-16 items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <Link href={"/"} className="mr-4 flex items-center space-x-2">
          <Image
            src={"/logo.jpg"}
            alt="logo"
            width={50}
            height={50}
            className="size-9 rounded-full transition-all duration-[3000] hover:animate-spin"
          />
          <span className="text-2xl font-bold">Courses</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
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
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isPending ? null : user ? (
              <></>
            ) : (
              <Link href={"/login"}>Login</Link>
            )}
            {user ? (
              <>
                <Link href={"/dashboard"}>
                  <Button>Dashboard</Button>
                </Link>

                <UserDropDown
                  email={user.email}
                  name={user.name}
                  image={user?.image ?? ""}
                />
              </>
            ) : (
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "outline" })}
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
