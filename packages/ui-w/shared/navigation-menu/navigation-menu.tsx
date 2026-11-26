"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@packages/ui-w/lib/utils"
import { NavigationMenuViewport } from "@packages/ui-w/shared/navigation-menu/navigation-menu-viewport"

export function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}): React.ReactElement {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      data-slot="navigation-menu"
      data-viewport={viewport}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}
