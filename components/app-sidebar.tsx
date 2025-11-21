"use client"

import { Coffee, MapPin, ReceiptText, Settings } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  { title: "Menu", href: "/", icon: Coffee },
  { title: "Map", href: "/map", icon: MapPin },
  { title: "My Orders", href: "/(app)/orders/12345", icon: ReceiptText },
  { title: "Settings", href: "#", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coffee className="h-5 w-5" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-base font-bold">Nomad-Cafe</div>
            <div className="text-xs text-muted-foreground">Powered by TON</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
