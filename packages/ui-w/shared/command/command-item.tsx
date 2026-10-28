"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

import { AutocompleteItem } from "@packages/ui-w/shared/autocomplete/autocomplete-item"

export function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteItem>): React.ReactElement {
  return (
    <AutocompleteItem className={cn("py-1.5", className)} data-slot="command-item" {...props} />
  )
}
