"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@packages/ui-w/lib/utils"

export function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props): React.ReactElement {
  return (
    <ComboboxPrimitive.GroupLabel
      className={cn("text-muted-foreground px-2 py-1.5 text-xs font-medium", className)}
      data-slot="combobox-group-label"
      {...props}
    />
  )
}
