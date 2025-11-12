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
                <div className="flex aspect-square size-12 items-center justify-center">
                  <img 
                    src="/zipli-white.svg" 
                    alt="Zipli" 
                    className="w-10 h-10 object-contain"
                  />
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
