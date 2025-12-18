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

const getNavData = () => {
  // Get user email from localStorage, fallback to demo user
  const userEmail = typeof window !== "undefined" ? localStorage.getItem("user_email") : null
  const displayName = userEmail ? getUserDisplayName(userEmail) : "Demo User"
  
  return {
    user: {
      name: displayName,
      email: userEmail || "demo@zipli.test",
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
}

// Helper function to get display name from email
function getUserDisplayName(email: string): string {
  if (email === "sodexo@zipli.test") {
    return "Sodexo User"
  }
  if (email === "demo@zipli.test") {
    return "Demo User"
  }
  // For other emails, use the part before @ as name
  return email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navData, setNavData] = React.useState(() => getNavData())

  // Update user data when component mounts and localStorage changes
  React.useEffect(() => {
    setNavData(getNavData())
    
    // Listen for storage changes (e.g., when user logs in/out)
    const handleStorageChange = () => {
      setNavData(getNavData())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

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
        {navData.navGroups.map((group) => (
          <NavMain
            key={group.label}
            label={group.collapsibleLabel ? undefined : group.label}
            collapsibleLabel={group.collapsibleLabel}
            items={group.items}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
