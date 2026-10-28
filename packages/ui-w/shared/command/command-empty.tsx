"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

import { AutocompleteEmpty } from "@packages/ui-w/shared/autocomplete/autocomplete-empty"

export function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteEmpty>): React.ReactElement {
  return (
    <AutocompleteEmpty
      className={cn("not-empty:py-6", className)}
      data-slot="command-empty"
      {...props}
    />
  )
}
