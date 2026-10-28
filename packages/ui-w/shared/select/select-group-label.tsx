"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

export function SelectGroupLabel(props: SelectPrimitive.GroupLabel.Props): React.ReactElement {
  return (
    <SelectPrimitive.GroupLabel
      className="text-muted-foreground px-2 py-1.5 text-sm font-medium"
      data-slot="select-group-label"
      {...props}
    />
  )
}
