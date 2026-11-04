"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarGroup } from "@packages/ui-w/shared/sidebar/sidebar-group"
import { SidebarGroupContent } from "@packages/ui-w/shared/sidebar/sidebar-group-content"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"

import type { MainMenuItem } from "@/data/menu/main"
import { isPathActive } from "@/lib/menu/is-path-active"

type MainMenuProps = {
  items: MainMenuItem[]
}

export function MainMenu({ items }: MainMenuProps): React.ReactElement {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isPathActive(pathname, item.path)
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  aria-current={isActive ? "page" : undefined}
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link href={item.path} prefetch={false}>
                    <Icon aria-hidden className="size-5! shrink-0" />
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
