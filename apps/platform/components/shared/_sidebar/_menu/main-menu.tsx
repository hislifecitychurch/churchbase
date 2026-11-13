"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarGroup } from "@packages/ui-w/shared/sidebar/sidebar-group"
import { SidebarGroupContent } from "@packages/ui-w/shared/sidebar/sidebar-group-content"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"

import { platformMenuItems } from "@/data/menu"
import { isPathActive } from "@/lib/menu/is-path-active"

export function MainMenu(): React.ReactElement {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
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
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
