"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

export function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props): React.ReactElement {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />
}
