"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@packages/ui-w/lib/utils"

export function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props): React.ReactElement {
  return (
    <SelectPrimitive.Value
      className={cn("data-placeholder:text-muted-foreground flex-1 truncate", className)}
      data-slot="select-value"
      {...props}
    />
  )
}
