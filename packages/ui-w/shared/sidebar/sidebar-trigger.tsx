"use client"

import * as React from "react"
import { IconArrowBarToLeft, IconArrowBarToRight } from "@tabler/icons-react"

import { cn } from "@repo/ui-w/lib/utils"
import { useSidebar } from "@repo/ui-w/hooks/use-sidebar"

import { SidebarMenuButton } from "@repo/ui-w/shared/sidebar/sidebar-menu-button"

type SidebarTriggerProps = Omit<
  React.ComponentProps<typeof SidebarMenuButton>,
  "asChild" | "isActive" | "tooltip"
>

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: SidebarTriggerProps): React.ReactElement {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"
  const label = isCollapsed ? "Expand sidebar" : "Collapse sidebar"
  const Icon = isCollapsed ? IconArrowBarToRight : IconArrowBarToLeft

  return (
    <SidebarMenuButton
      aria-label={label}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      tooltip={label}
      className={cn("text-sidebar-foreground", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <Icon aria-hidden className="size-5! shrink-0" />
      <span className={cn("normal-case", isCollapsed && "sr-only")}>{label}</span>
    </SidebarMenuButton>
  )
}
