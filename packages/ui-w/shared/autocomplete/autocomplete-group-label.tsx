"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"

import { cn } from "@packages/ui-w/lib/utils"

export function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.GroupLabel
      className={cn("text-muted-foreground px-2 py-1.5 text-xs font-medium", className)}
      data-slot="autocomplete-group-label"
      {...props}
    />
  )
}
