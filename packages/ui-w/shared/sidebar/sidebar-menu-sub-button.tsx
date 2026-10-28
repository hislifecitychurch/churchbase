"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@packages/ui-w/lib/utils"

export function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}): React.ReactElement {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "peer/menu-button text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground relative flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-xl px-2 outline-hidden before:absolute before:top-1/2 before:left-2 before:block before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:content-[''] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:text-sidebar-accent-foreground data-[active=true]:ps-5 data-[active=true]:font-medium data-[active=true]:before:opacity-100",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  )
}
