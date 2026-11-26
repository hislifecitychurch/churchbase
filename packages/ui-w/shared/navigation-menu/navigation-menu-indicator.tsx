"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@packages/ui-w/lib/utils"

export function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>): React.ReactElement {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      data-slot="navigation-menu-indicator"
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-none" />
    </NavigationMenuPrimitive.Indicator>
  )
}
