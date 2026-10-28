"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"

import { cn } from "@packages/ui-w/lib/utils"

export function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Empty
      className={cn(
        "text-muted-foreground text-center text-base not-empty:p-2 sm:text-sm",
        className,
      )}
      data-slot="autocomplete-empty"
      {...props}
    />
  )
}
