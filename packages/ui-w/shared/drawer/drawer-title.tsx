"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@packages/ui-w/lib/utils"

export function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props): React.ReactElement {
  return (
    <DrawerPrimitive.Title
      className={cn("font-heading text-xl leading-none font-semibold", className)}
      data-slot="drawer-title"
      {...props}
    />
  )
}
