"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconSettings } from "@tabler/icons-react"

import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { SidebarTrigger } from "@packages/ui-w/shared/sidebar/sidebar-trigger"

import { isPathActive } from "@/lib/menu/is-path-active"

export function FooterMenu(): React.ReactElement {
  const pathname = usePathname()
  const isSettingsActive = isPathActive(pathname, "/settings")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          aria-current={isSettingsActive ? "page" : undefined}
          className="group-data-[collapsible=icon]:justify-center"
          isActive={isSettingsActive}
          tooltip="Settings"
        >
          <Link href="/settings" prefetch={false}>
            <IconSettings aria-hidden className="size-5! shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarTrigger className="w-full justify-start p-2! text-sm! font-normal! group-data-[collapsible=icon]:justify-center" />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
