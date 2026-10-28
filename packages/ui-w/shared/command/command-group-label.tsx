"use client"

import * as React from "react"

import { AutocompleteGroupLabel } from "@packages/ui-w/shared/autocomplete/autocomplete-group-label"

export function CommandGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteGroupLabel>): React.ReactElement {
  return <AutocompleteGroupLabel className={className} data-slot="command-group-label" {...props} />
}
