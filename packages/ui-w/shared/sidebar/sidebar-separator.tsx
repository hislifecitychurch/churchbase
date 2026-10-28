"use client"

import * as React from "react"

import { cn } from "@repo/ui-w/lib/utils"

import { Separator } from "@repo/ui-w/shared/separator/separator"

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>): React.ReactElement {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}
