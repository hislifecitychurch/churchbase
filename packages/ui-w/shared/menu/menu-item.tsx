"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@packages/ui-w/lib/utils"

export function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}): React.ReactElement {
  return (
    <MenuPrimitive.Item
      className={cn(
        "text-popover-foreground data-highlighted:bg-accent data-[variant=destructive]:text-destructive-text data-highlighted:text-accent-foreground flex min-h-8 cursor-pointer items-center gap-2 rounded-xl px-2 py-1 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 data-inset:ps-8 sm:min-h-7 sm:text-sm [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0 [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="menu-item"
      data-variant={variant}
      {...props}
    />
  )
}
