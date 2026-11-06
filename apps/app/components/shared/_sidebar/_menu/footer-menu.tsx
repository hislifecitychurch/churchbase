"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { SidebarTrigger } from "@packages/ui-w/shared/sidebar/sidebar-trigger"

import { footerMenuItems } from "@/data/menu/footer"
import { isPathActive } from "@/lib/menu/is-path-active"

export function FooterMenu(): React.ReactElement {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {footerMenuItems.map((item) => {
        if (item.type === "sidebar-trigger") {
          return (
            <SidebarMenuItem key={item.type}>
              <SidebarTrigger className="w-full justify-start p-2! text-sm! font-normal!" />
            </SidebarMenuItem>
          )
        }

        const isActive = isPathActive(pathname, item.path)
        const Icon = item.icon

        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              aria-current={isActive ? "page" : undefined}
              isActive={isActive}
              tooltip={item.title}
            >
              <Link href={item.path} prefetch={false}>
                <Icon aria-hidden />
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
