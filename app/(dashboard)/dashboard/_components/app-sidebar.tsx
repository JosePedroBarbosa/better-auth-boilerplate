"use client";

import * as React from "react";
import { LucideCalculator, Wallet, History, Star } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

import Logo from "@/public/logo.svg";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Link 1",
      url: "#",
      icon: Wallet,
      isActive: true,
    },
    {
      title: "Link 2",
      url: "#",
      icon: History,
      isActive: true,
    },
     {
      title: "Link 3",
      url: "#",
      icon: Star,
      isActive: true,
    },
    {
      title: "Link 4",
      url: "#",
      icon: LucideCalculator,
      isActive: true,
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: LucideCalculator,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center px-4 py-2 text-white select-none border-b">
        <Link
          href="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity group-data-[collapsible=icon]:justify-center"
        >
          <Image
            src={Logo}
            width={50}
            height={50}
            alt="Logo"
            className="rounded-lg p-1 dark:invert group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 transition-all duration-200 flex-shrink-0"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
