"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

import { AutocompleteSeparator } from "@packages/ui-w/shared/autocomplete/autocomplete-separator"

export function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteSeparator>): React.ReactElement {
  return (
    <AutocompleteSeparator
      className={cn("my-2", className)}
      data-slot="command-separator"
      {...props}
    />
  )
}
