"use client"

import { IconCheck, IconSelector } from "@tabler/icons-react"

import { useSidebar } from "@packages/ui-w/hooks/use-sidebar"
import { Menu } from "@packages/ui-w/shared/menu/menu"
import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"

import { ministries } from "@/data/ministries"

type MinistrySwitcherProps = {
  activeSlug: string
  onMinistryChange: (slug: string) => void
}

export function MinistrySwitcher({
  activeSlug,
  onMinistryChange,
}: MinistrySwitcherProps): React.ReactElement {
  const { isMobile } = useSidebar()

  const activeMinistry =
    ministries.find((ministry) => ministry.slug === activeSlug) ?? ministries[0]
  const ActiveIcon = activeMinistry.icon

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                aria-label={activeMinistry.name}
                className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl">
              <ActiveIcon aria-hidden className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{activeMinistry.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {activeMinistry.detail}
              </span>
            </div>
            <IconSelector
              aria-hidden
              className="ms-auto size-4 group-data-[collapsible=icon]:hidden"
            />
          </MenuTrigger>
          <MenuPopup
            align="start"
            className="w-56"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">Ministries</div>
            {ministries.map((ministry) => {
              const MinistryIcon = ministry.icon

              return (
                <MenuItem
                  key={ministry.slug}
                  className="gap-2 p-2"
                  onClick={() => onMinistryChange(ministry.slug)}
                >
                  <div className="border-border flex size-6 items-center justify-center rounded-md border">
                    <MinistryIcon aria-hidden className="size-3.5 shrink-0" />
                  </div>
                  <span className="min-w-0 flex-1 truncate">{ministry.name}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">{ministry.detail}</span>
                  {ministry.slug === activeSlug ? (
                    <IconCheck aria-hidden className="ms-auto size-4" />
                  ) : null}
                </MenuItem>
              )
            })}
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
