"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { IconX } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Button } from "@packages/ui-w/shared/button/button"
import { SheetBackdrop } from "@packages/ui-w/shared/sheet/sheet-backdrop"
import { SheetPortal } from "@packages/ui-w/shared/sheet/sheet-portal"
import { SheetViewport } from "@packages/ui-w/shared/sheet/sheet-viewport"

export function SheetPopup({
  className,
  children,
  showCloseButton = true,
  side = "right",
  variant = "default",
  closeProps,
  portalProps,
  ...props
}: SheetPrimitive.Popup.Props & {
  showCloseButton?: boolean
  side?: "right" | "left" | "top" | "bottom"
  variant?: "default" | "inset"
  closeProps?: SheetPrimitive.Close.Props
  portalProps?: SheetPrimitive.Portal.Props
}): React.ReactElement {
  return (
    <SheetPortal {...portalProps}>
      <SheetBackdrop />
      <SheetViewport side={side} variant={variant}>
        <SheetPrimitive.Popup
          className={cn(
            "bg-popover text-popover-foreground relative flex max-h-full min-h-0 w-full min-w-0 flex-col transition-[opacity,translate] duration-200 ease-in-out will-change-transform not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 data-ending-style:opacity-0 data-starting-style:opacity-0 max-sm:before:hidden",
            side === "bottom" &&
              "row-start-2 border-t data-ending-style:translate-y-8 data-starting-style:translate-y-8",
            side === "top" &&
              "border-b data-ending-style:-translate-y-8 data-starting-style:-translate-y-8",
            side === "left" &&
              "w-[calc(100%-(--spacing(12)))] max-w-md border-e data-ending-style:-translate-x-8 data-starting-style:-translate-x-8",
            side === "right" &&
              "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s data-ending-style:translate-x-8 data-starting-style:translate-x-8",
            variant === "inset" &&
              "before:hidden sm:rounded-xl sm:border sm:before:rounded-xl sm:**:data-[slot=sheet-footer]:rounded-xl",
            className,
          )}
          data-slot="sheet-popup"
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              aria-label="Close"
              className="absolute inset-e-2 top-2"
              render={<Button size="icon" variant="ghost" />}
              {...closeProps}
            >
              <IconX />
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetViewport>
    </SheetPortal>
  )
}
