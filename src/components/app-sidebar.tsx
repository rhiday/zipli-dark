"use client"

import * as React from "react"
import {
  LayoutPanelLeft,
  BarChart3,
  MessageCircle,
  ListChecks,
  Megaphone,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { SidebarNotification } from "@/components/sidebar-notification"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Zipli",
    email: "admin@foodlink.fi",
    avatar: "",
  },
  navGroups: [
    {
      label: "Navigation",
      items: [
        { title: "Dashboard", url: "/dashboard-2", icon: LayoutPanelLeft },
        { title: "Operations", url: "/daily-operations", icon: ListChecks },
        {
          title: "Impact metrics",
          url: "#",
          icon: BarChart3,
          items: [
            { title: "Business impact", url: "/impact/business" },
            { title: "Social impact", url: "/impact/social" },
            { title: "Climate impact", url: "/impact/climate" },
          ],
        },
      ],
    },
    {
      label: "Communication",
      items: [
        { title: "Feedback", url: "/communication/feedback", icon: Megaphone },
        { title: "Messaging", url: "/communication/messaging", icon: MessageCircle },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Zipli</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotification />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
