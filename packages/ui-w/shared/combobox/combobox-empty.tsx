"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@packages/ui-w/lib/utils"

export function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props): React.ReactElement {
  return (
    <ComboboxPrimitive.Empty
      className={cn(
        "text-muted-foreground text-center text-base not-empty:p-2 sm:text-sm",
        className,
      )}
      data-slot="combobox-empty"
      {...props}
    />
  )
}
