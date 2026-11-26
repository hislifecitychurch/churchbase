"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

import { AutocompleteList } from "@packages/ui-w/shared/autocomplete/autocomplete-list"

export function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteList>): React.ReactElement {
  return (
    <AutocompleteList
      className={cn("not-empty:scroll-py-2 not-empty:p-2", className)}
      data-slot="command-list"
      {...props}
    />
  )
}
