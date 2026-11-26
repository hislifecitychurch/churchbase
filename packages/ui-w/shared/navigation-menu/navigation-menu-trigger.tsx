"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@packages/ui-w/lib/utils"
import { navigationMenuTriggerStyle } from "@packages/ui-w/shared/styles"

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>): React.ReactElement {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      data-slot="navigation-menu-trigger"
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        aria-hidden="true"
        className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}
