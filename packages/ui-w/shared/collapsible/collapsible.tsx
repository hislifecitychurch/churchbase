"use client"

import * as React from "react"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

export function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props): React.ReactElement {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}
