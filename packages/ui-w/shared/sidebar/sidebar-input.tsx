"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

import { Input } from "@packages/ui-w/shared/input/input"

export function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>): React.ReactElement {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full", className)}
      {...props}
    />
  )
}
