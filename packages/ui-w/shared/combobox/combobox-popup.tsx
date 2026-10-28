"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@packages/ui-w/lib/utils"
import { ComboboxContext } from "@packages/ui-w/contexts/combobox-context"

export function ComboboxPopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  collisionAvoidance,
  anchor: anchorProp,
  portalProps,
  ...props
}: ComboboxPrimitive.Popup.Props & {
  align?: ComboboxPrimitive.Positioner.Props["align"]
  sideOffset?: ComboboxPrimitive.Positioner.Props["sideOffset"]
  alignOffset?: ComboboxPrimitive.Positioner.Props["alignOffset"]
  side?: ComboboxPrimitive.Positioner.Props["side"]
  collisionAvoidance?: ComboboxPrimitive.Positioner.Props["collisionAvoidance"]
  anchor?: ComboboxPrimitive.Positioner.Props["anchor"]
  portalProps?: ComboboxPrimitive.Portal.Props
}): React.ReactElement {
  const { chipsRef } = React.useContext(ComboboxContext)
  const anchor = anchorProp ?? chipsRef

  return (
    <ComboboxPrimitive.Portal {...portalProps}>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
        collisionAvoidance={collisionAvoidance}
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <span
          className={cn(
            "bg-popover border-border relative flex max-h-full max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) rounded-xl border transition-[scale,opacity] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
            className,
          )}
        >
          <ComboboxPrimitive.Popup
            className="text-foreground flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col"
            data-slot="combobox-popup"
            {...props}
          >
            {children}
          </ComboboxPrimitive.Popup>
        </span>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}
