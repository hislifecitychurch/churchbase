"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { SidebarTrigger } from "@packages/ui-w/shared/sidebar/sidebar-trigger"

import { UserMenu } from "@/components/shared/_sidebar/_menu/user-menu"
import { platformFooterMenuItems } from "@/data/menu"
import { isPathActive } from "@/lib/menu/is-path-active"

export function FooterMenu(): React.ReactElement {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {platformFooterMenuItems.map((item) => {
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
      <SidebarMenuItem>
        <SidebarTrigger className="w-full justify-start p-2! text-sm! font-normal!" />
      </SidebarMenuItem>
      <UserMenu />
    </SidebarMenu>
  )
}
