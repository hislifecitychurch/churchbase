"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

export function MenuGroup(props: MenuPrimitive.Group.Props): React.ReactElement {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />
}
