"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { DrawerTrigger } from "@packages/ui-w/shared/drawer/drawer-trigger"

export function DrawerMenuTrigger({
  className,
  children,
  ...props
}: DrawerPrimitive.Trigger.Props): React.ReactElement {
  return (
    <DrawerTrigger
      className={cn(
        "text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-9 w-full cursor-default items-center gap-2 rounded-xl px-2 py-1 text-base outline-none select-none sm:min-h-8 sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(:last-child)]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="drawer-menu-trigger"
      {...props}
    >
      {children}
      <IconChevronRight className="ms-auto -me-0.5 opacity-80" />
    </DrawerTrigger>
  )
}
