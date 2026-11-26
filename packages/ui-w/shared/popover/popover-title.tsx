"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@packages/ui-w/lib/utils"

export function PopoverTitle({
  className,
  ...props
}: PopoverPrimitive.Title.Props): React.ReactElement {
  return (
    <PopoverPrimitive.Title
      className={cn("text-lg leading-none font-medium", className)}
      data-slot="popover-title"
      {...props}
    />
  )
}
