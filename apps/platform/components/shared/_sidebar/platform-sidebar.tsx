"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconBuildingChurch } from "@tabler/icons-react"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { SidebarTrigger } from "@packages/ui-w/shared/sidebar/sidebar-trigger"

import { platformMenuItems } from "@/data/menu"
import { isPathActive } from "@/lib/menu/is-path-active"

export function PlatformSidebar(): React.ReactElement {
  const pathname = usePathname()

  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Churchbase Platform">
                <Link href="/" prefetch={false}>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl">
                    <IconBuildingChurch aria-hidden className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">Churchbase</span>
                    <span className="text-muted-foreground truncate text-xs">Platform</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {platformMenuItems.map((item) => {
              const isActive = isPathActive(pathname, item.href)
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    aria-current={isActive ? "page" : undefined}
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} prefetch={false}>
                      <Icon aria-hidden />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarTrigger className="w-full justify-start p-2! text-sm! font-normal!" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
