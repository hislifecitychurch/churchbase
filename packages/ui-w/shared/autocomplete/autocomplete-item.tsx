"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"

import { cn } from "@packages/ui-w/lib/utils"

export function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Item
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground flex min-h-8 cursor-default items-center rounded-xl px-2 py-1 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
        className,
      )}
      data-slot="autocomplete-item"
      {...props}
    >
      {children}
    </AutocompletePrimitive.Item>
  )
}
