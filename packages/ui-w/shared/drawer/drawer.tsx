"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import type React from "react"

import {
  DrawerContext,
  directionMap,
  type DrawerPosition,
} from "@repo/ui-w/contexts/drawer-context"

export { DrawerBackdrop } from "@repo/ui-w/shared/drawer/drawer-backdrop"
export { DrawerClose } from "@repo/ui-w/shared/drawer/drawer-close"
export { DrawerContent } from "@repo/ui-w/shared/drawer/drawer-content"
export { DrawerCreateHandle } from "@repo/ui-w/shared/drawer/drawer-create-handle"
export { DrawerDescription } from "@repo/ui-w/shared/drawer/drawer-description"
export { DrawerFooter } from "@repo/ui-w/shared/drawer/drawer-footer"
export { DrawerHeader } from "@repo/ui-w/shared/drawer/drawer-header"
export { DrawerMenu } from "@repo/ui-w/shared/drawer/drawer-menu"
export { DrawerMenuCheckboxItem } from "@repo/ui-w/shared/drawer/drawer-menu-checkbox-item"
export { DrawerMenuGroup } from "@repo/ui-w/shared/drawer/drawer-menu-group"
export { DrawerMenuGroupLabel } from "@repo/ui-w/shared/drawer/drawer-menu-group-label"
export { DrawerMenuItem } from "@repo/ui-w/shared/drawer/drawer-menu-item"
export { DrawerMenuRadioGroup } from "@repo/ui-w/shared/drawer/drawer-menu-radio-group"
export { DrawerMenuRadioItem } from "@repo/ui-w/shared/drawer/drawer-menu-radio-item"
export { DrawerMenuSeparator } from "@repo/ui-w/shared/drawer/drawer-menu-separator"
export { DrawerMenuTrigger } from "@repo/ui-w/shared/drawer/drawer-menu-trigger"
export { DrawerPanel } from "@repo/ui-w/shared/drawer/drawer-panel"
export { DrawerPopup } from "@repo/ui-w/shared/drawer/drawer-popup"
export { DrawerPortal } from "@repo/ui-w/shared/drawer/drawer-portal"
export { DrawerSwipeArea } from "@repo/ui-w/shared/drawer/drawer-swipe-area"
export { DrawerTitle } from "@repo/ui-w/shared/drawer/drawer-title"
export { DrawerTrigger } from "@repo/ui-w/shared/drawer/drawer-trigger"
export { DrawerViewport } from "@repo/ui-w/shared/drawer/drawer-viewport"
export type { DrawerPosition } from "@repo/ui-w/contexts/drawer-context"

export function Drawer({
  swipeDirection,
  position = "bottom",
  ...props
}: DrawerPrimitive.Root.Props & {
  position?: DrawerPosition
}): React.ReactElement {
  return (
    <DrawerContext.Provider value={{ position }}>
      <DrawerPrimitive.Root swipeDirection={swipeDirection ?? directionMap[position]} {...props} />
    </DrawerContext.Provider>
  )
}

export { DrawerPrimitive }
