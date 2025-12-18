"use client"

import * as React from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  label,
  items,
  collapsibleLabel,
}: {
  label?: string
  collapsibleLabel?: {
    title: string
    icon?: LucideIcon
  }
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
      isActive?: boolean
      items?: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
      }[]
    }[]
  }[]
}) {
  const pathname = usePathname()

  const shouldBeOpen = (item: (typeof items)[number]) => {
    if (item.isActive) return true

    // Open if this is a parent of the current route
    if (pathname === item.url) return true
    return item.items?.some((subItem) => pathname === subItem.url) || false
  }

  const renderNestedSubItems = (
    subItems: NonNullable<(typeof items)[number]["items"]>
  ) => {
    return subItems.map((subItem) => (
      <React.Fragment key={subItem.title}>
        {subItem.items?.length ? (
          <Collapsible
            asChild
            defaultOpen={
              pathname === subItem.url || subItem.items.some((i) => pathname === i.url)
            }
            className="group/collapsible"
          >
            <SidebarMenuSubItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton
                  className="cursor-pointer"
                  isActive={
                    pathname === subItem.url || subItem.items.some((i) => pathname === i.url)
                  }
                >
                  {subItem.icon && <subItem.icon />}
                  <span>{subItem.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {subItem.items.map((leaf) => (
                    <SidebarMenuSubItem key={leaf.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="cursor-pointer"
                        isActive={pathname === leaf.url}
                      >
                        <Link href={leaf.url}>
                          {leaf.icon && <leaf.icon />}
                          <span>{leaf.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuSubItem>
          </Collapsible>
        ) : (
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              asChild
              className="cursor-pointer"
              isActive={pathname === subItem.url}
            >
              <Link href={subItem.url}>
                {subItem.icon && <subItem.icon />}
                <span>{subItem.title}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )}
      </React.Fragment>
    ))
  }

  const renderTopLevelItems = (entries: typeof items) => {
    return entries.map((item) => (
      <Collapsible
        key={item.title}
        asChild
        defaultOpen={shouldBeOpen(item)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          {item.items?.length ? (
            <>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>{renderNestedSubItems(item.items)}</SidebarMenuSub>
              </CollapsibleContent>
            </>
          ) : (
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className="cursor-pointer"
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </Collapsible>
    ))
  }

  const renderSubLevelItems = (entries: typeof items) => {
    return entries.map((item) => (
      <Collapsible
        key={item.title}
        asChild
        defaultOpen={shouldBeOpen(item)}
        className="group/collapsible"
      >
        <SidebarMenuSubItem>
          {item.items?.length ? (
            <>
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton
                  className="cursor-pointer"
                  isActive={pathname === item.url || item.items.some((i) => pathname === i.url)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>{renderNestedSubItems(item.items)}</SidebarMenuSub>
              </CollapsibleContent>
            </>
          ) : (
            <SidebarMenuSubButton
              asChild
              className="cursor-pointer"
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuSubButton>
          )}
        </SidebarMenuSubItem>
      </Collapsible>
    ))
  }

  return (
    <SidebarGroup>
      {collapsibleLabel ? (
        <SidebarMenu>
          <Collapsible
            asChild
            defaultOpen={items.some((i) => shouldBeOpen(i))}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={collapsibleLabel.title}
                  className="cursor-pointer"
                >
                  {collapsibleLabel.icon && <collapsibleLabel.icon />}
                  <span>{collapsibleLabel.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>{renderSubLevelItems(items)}</SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      ) : (
        <>
          {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
          <SidebarMenu>{renderTopLevelItems(items)}</SidebarMenu>
        </>
      )}
    </SidebarGroup>
  )
}
