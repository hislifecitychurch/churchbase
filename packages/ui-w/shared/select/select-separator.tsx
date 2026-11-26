"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@packages/ui-w/lib/utils"

export function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props): React.ReactElement {
  return (
    <SelectPrimitive.Separator
      className={cn("bg-border mx-2 my-1 h-px", className)}
      data-slot="select-separator"
      {...props}
    />
  )
}
