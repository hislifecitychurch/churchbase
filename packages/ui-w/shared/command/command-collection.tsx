"use client"

import * as React from "react"

import { AutocompleteCollection } from "@packages/ui-w/shared/autocomplete/autocomplete-collection"

export function CommandCollection({
  ...props
}: React.ComponentProps<typeof AutocompleteCollection>): React.ReactElement {
  return <AutocompleteCollection data-slot="command-collection" {...props} />
}
