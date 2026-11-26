"use client"

import * as React from "react"

import { AutocompleteGroup } from "@packages/ui-w/shared/autocomplete/autocomplete-group"

export function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteGroup>): React.ReactElement {
  return <AutocompleteGroup className={className} data-slot="command-group" {...props} />
}
