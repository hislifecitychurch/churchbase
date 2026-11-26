"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@packages/ui-w/lib/utils"

import { MenuPortal } from "@packages/ui-w/shared/menu/menu-portal"

export function MenuPopup({
  children,
  className,
  sideOffset = 4,
  align = "center",
  alignOffset,
  side = "bottom",
  anchor,
  portalProps,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"]
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"]
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"]
  side?: MenuPrimitive.Positioner.Props["side"]
  anchor?: MenuPrimitive.Positioner.Props["anchor"]
  portalProps?: MenuPrimitive.Portal.Props
}): React.ReactElement {
  return (
    <MenuPortal {...portalProps}>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
        data-slot="menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            "bg-popover border-border relative flex origin-(--transform-origin) overflow-hidden rounded-xl border outline-none not-dark:bg-clip-padding not-[class*='w-']:min-w-32 before:pointer-events-none before:absolute before:inset-0 before:rounded-xl focus:outline-none",
            className,
          )}
          data-slot="menu-popup"
          {...props}
        >
          <div className="max-h-(--available-height) w-full overflow-y-auto p-1">{children}</div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPortal>
  )
}
