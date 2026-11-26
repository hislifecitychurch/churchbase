"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

export function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}): React.ReactElement {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={cn(
        "text-foreground data-highlighted:bg-accent data-popup-open:bg-accent data-highlighted:text-accent-foreground data-popup-open:text-accent-foreground flex min-h-8 items-center gap-2 rounded-xl px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-disabled:opacity-64 data-inset:ps-8 sm:min-h-7 sm:text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&>svg:not(:last-child)]:-mx-0.5",
        className,
      )}
      data-inset={inset}
      data-slot="menu-sub-trigger"
      {...props}
    >
      {children}
      <IconChevronDown className="ms-auto -me-0.5 opacity-80" />
    </MenuPrimitive.SubmenuTrigger>
  )
}
