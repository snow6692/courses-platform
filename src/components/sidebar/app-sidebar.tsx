"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconMoodSmile,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/providers/LanguageContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t, language } = useLanguage();

  const navMain = [
    {
      title: t("admin.sidebar.dashboard"),
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: t("admin.sidebar.courses"),
      url: "/admin/courses",
      icon: IconListDetails,
    },
    {
      title: t("admin.sidebar.students"),
      url: "/admin/students",
      icon: IconUsers,
    },
    {
      title: t("admin.sidebar.memes"),
      url: "/admin/memes",
      icon: IconMoodSmile,
    },
  ];

  // Set sidebar side based on language direction
  const sidebarSide = language === "ar" ? "right" : "left";

  return (
    <Sidebar collapsible="offcanvas" side={sidebarSide} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src={"/images/logo.svg"}
                  alt="logo"
                  width={50}
                  height={50}
                  className="size-9 rounded-full transition-all duration-[3000] hover:animate-spin"
                />
                <span className="text-base font-semibold">
                  {t("navbar.courses")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
