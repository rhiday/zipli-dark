"use client"

import * as React from "react"
import {
  LayoutPanelLeft,
  BarChart3,
  MessageCircle,
  ListChecks,
  Megaphone,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    name: "Demo User",
    email: "demo@zipli.test",
    avatar: "/avatar.png",
  },
  navGroups: [
    {
      label: "Navigation",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutPanelLeft },
        {
          title: "Operations",
          url: "#",
          icon: ListChecks,
          items: [
            { title: "Daily operations", url: "/daily-operations", icon: ListChecks },
            { title: "Feedback", url: "/communication/feedback", icon: Megaphone },
          ],
        },
        {
          title: "Impact",
          url: "#",
          icon: BarChart3,
          items: [
            { title: "Business impact", url: "/impact/business" },
            { title: "Social impact", url: "/impact/social" },
            { title: "Climate impact", url: "/impact/climate" },
            { title: "Impact analyzer", url: "/impact/analyzer" },
          ],
        },
      ],
    },
    {
      label: "Stories",
      collapsibleLabel: { title: "Stories", icon: BookOpen },
      items: [
{ title: "Templates", url: "/stories/templates" },
        { title: "Story builder", url: "/stories/builder" },
        { title: "Brand settings", url: "/stories/brand-settings" },
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
              <Link href="/dashboard">
                <div className="flex aspect-square size-12 items-center justify-center">
                  <Image 
                    src="/zipli-white.svg" 
                    alt="Zipli" 
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain
            key={group.label}
            label={group.collapsibleLabel ? undefined : group.label}
            collapsibleLabel={group.collapsibleLabel}
            items={group.items}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
