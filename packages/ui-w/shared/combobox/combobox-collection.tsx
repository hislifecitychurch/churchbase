"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

export function ComboboxCollection(props: ComboboxPrimitive.Collection.Props): React.ReactElement {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}
