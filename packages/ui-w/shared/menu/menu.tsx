"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

export const MenuCreateHandle: typeof MenuPrimitive.createHandle = MenuPrimitive.createHandle

export const Menu: typeof MenuPrimitive.Root = MenuPrimitive.Root

export function MenuSub(props: MenuPrimitive.SubmenuRoot.Props): React.ReactElement {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />
}
