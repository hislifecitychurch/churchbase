"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@packages/ui-w/lib/utils"

export function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props): React.ReactElement {
  return (
    <ComboboxPrimitive.Separator
      className={cn("bg-border mx-2 my-1 h-px last:hidden", className)}
      data-slot="combobox-separator"
      {...props}
    />
  )
}
