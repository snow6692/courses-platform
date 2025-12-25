"use client";
import {
  BookOpen,
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  HomeIcon,
  LayoutDashboardIcon,
  User,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageContext";

import Logout from "./Logout";

interface UserDropDownProps {
  email: string;
  name: string;
  role: string;
  image?: string;
}

export default function UserDropDown({
  image,
  name,
  email,
  role,
}: UserDropDownProps) {
  const { t } = useLanguage();

  // Get initials from name (first letter of first name + first letter of last name)
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (
        parts[0]?.charAt(0) + parts[parts.length - 1]?.charAt(0)
      ).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Only require name or email to show dropdown
  if (!name && !email) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>{t("navbar.home")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User size={16} className="opacity-60" aria-hidden="true" />
              <span>{t("user_menu.profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/favorites">
              <Heart size={16} className="opacity-60" aria-hidden="true" />
              <span>{t("user_menu.favorites")}</span>
            </Link>
          </DropdownMenuItem>
          {role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <BriefcaseBusinessIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>{t("user_menu.admin")}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/courses">
              <BookOpen size={16} className="opacity-60" aria-hidden="true" />
              <span>{t("navbar.courses")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboardIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{t("navbar.dashboard")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
