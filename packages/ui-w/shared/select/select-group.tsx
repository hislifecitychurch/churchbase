"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

export function SelectGroup(props: SelectPrimitive.Group.Props): React.ReactElement {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}
