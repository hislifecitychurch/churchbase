"use client"

import { IconCheck, IconBuildingChurch, IconSelector } from "@tabler/icons-react"

import type { AccessContext } from "@/api/access-contexts"

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
  contexts: AccessContext[]
  activeContextID: string | null
  onContextChange: (context: AccessContext) => void
}

const roleLabels: Record<AccessContext["role"], string> = {
  admin: "Admin",
  staff: "Staff",
  lead: "Leader",
  member: "Member",
  global_admin: "Global Admin",
  global_staff: "Global Staff",
}

function contextName(context: AccessContext): string {
  return context.kind === "church" ? "Church-wide" : context.name
}

function contextDetail(context: AccessContext, contexts: AccessContext[]): string {
  const role = roleLabels[context.role]
  const duplicate = contexts.some(
    (candidate) =>
      candidate.id !== context.id &&
      candidate.kind === context.kind &&
      candidate.type === context.type,
  )
  return duplicate ? `${role} · ${context.church_name}` : role
}

export function MinistrySwitcher({
  contexts,
  activeContextID,
  onContextChange,
}: MinistrySwitcherProps): React.ReactElement | null {
  const { isMobile } = useSidebar()
  const activeContext = contexts.find((context) => context.id === activeContextID) ?? contexts[0]
  if (!activeContext) {
    return null
  }

  const ActiveIcon =
    ministries.find((ministry) => ministry.type === activeContext.type)?.icon ?? IconBuildingChurch

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                aria-label={contextName(activeContext)}
                className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl">
              <ActiveIcon aria-hidden className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{contextName(activeContext)}</span>
              <span className="text-muted-foreground truncate text-xs">
                {contextDetail(activeContext, contexts)}
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
            <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">Workspaces</div>
            {contexts.map((context) => {
              const ContextIcon =
                ministries.find((ministry) => ministry.type === context.type)?.icon ??
                IconBuildingChurch

              return (
                <MenuItem
                  key={context.id}
                  className="gap-2 p-2"
                  onClick={() => onContextChange(context)}
                >
                  <div className="border-border flex size-6 items-center justify-center rounded-md border">
                    <ContextIcon aria-hidden className="size-3.5 shrink-0" />
                  </div>
                  <span className="min-w-0 flex-1 truncate">{contextName(context)}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {contextDetail(context, contexts)}
                  </span>
                  {context.id === activeContextID ? (
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
