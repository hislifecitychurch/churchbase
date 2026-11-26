"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@packages/ui-w/lib/utils"

export function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>): React.ReactElement {
  return (
    <NavigationMenuPrimitive.Item
      className={cn("relative cursor-pointer", className)}
      data-slot="navigation-menu-item"
      {...props}
    />
  )
}
