"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import type React from "react"

import {
  DrawerContext,
  directionMap,
  type DrawerPosition,
} from "@packages/ui-w/contexts/drawer-context"

export { DrawerBackdrop } from "@packages/ui-w/shared/drawer/drawer-backdrop"
export { DrawerClose } from "@packages/ui-w/shared/drawer/drawer-close"
export { DrawerContent } from "@packages/ui-w/shared/drawer/drawer-content"
export { DrawerCreateHandle } from "@packages/ui-w/shared/drawer/drawer-create-handle"
export { DrawerDescription } from "@packages/ui-w/shared/drawer/drawer-description"
export { DrawerFooter } from "@packages/ui-w/shared/drawer/drawer-footer"
export { DrawerHeader } from "@packages/ui-w/shared/drawer/drawer-header"
export { DrawerMenu } from "@packages/ui-w/shared/drawer/drawer-menu"
export { DrawerMenuCheckboxItem } from "@packages/ui-w/shared/drawer/drawer-menu-checkbox-item"
export { DrawerMenuGroup } from "@packages/ui-w/shared/drawer/drawer-menu-group"
export { DrawerMenuGroupLabel } from "@packages/ui-w/shared/drawer/drawer-menu-group-label"
export { DrawerMenuItem } from "@packages/ui-w/shared/drawer/drawer-menu-item"
export { DrawerMenuRadioGroup } from "@packages/ui-w/shared/drawer/drawer-menu-radio-group"
export { DrawerMenuRadioItem } from "@packages/ui-w/shared/drawer/drawer-menu-radio-item"
export { DrawerMenuSeparator } from "@packages/ui-w/shared/drawer/drawer-menu-separator"
export { DrawerMenuTrigger } from "@packages/ui-w/shared/drawer/drawer-menu-trigger"
export { DrawerPanel } from "@packages/ui-w/shared/drawer/drawer-panel"
export { DrawerPopup } from "@packages/ui-w/shared/drawer/drawer-popup"
export { DrawerPortal } from "@packages/ui-w/shared/drawer/drawer-portal"
export { DrawerSwipeArea } from "@packages/ui-w/shared/drawer/drawer-swipe-area"
export { DrawerTitle } from "@packages/ui-w/shared/drawer/drawer-title"
export { DrawerTrigger } from "@packages/ui-w/shared/drawer/drawer-trigger"
export { DrawerViewport } from "@packages/ui-w/shared/drawer/drawer-viewport"
export type { DrawerPosition } from "@packages/ui-w/contexts/drawer-context"

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
