"use client"

import * as React from "react"
import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@packages/ui-w/lib/utils"

import { CommandDialogPortal } from "@packages/ui-w/shared/command/command-dialog-portal"
import { CommandDialogBackdrop } from "@packages/ui-w/shared/command/command-dialog-backdrop"
import { CommandDialogViewport } from "@packages/ui-w/shared/command/command-dialog-viewport"

export function CommandDialogPopup({
  className,
  children,
  portalProps,
  ...props
}: CommandDialogPrimitive.Popup.Props & {
  portalProps?: CommandDialogPrimitive.Portal.Props
}): React.ReactElement {
  return (
    <CommandDialogPortal {...portalProps}>
      <CommandDialogBackdrop />
      <CommandDialogViewport>
        <CommandDialogPrimitive.Popup
          className={cn(
            "bg-popover text-popover-foreground before:bg-muted/72 relative row-start-2 flex max-h-105 min-h-0 w-full max-w-xl min-w-0 translate-y-[calc(-1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))] flex-col overflow-hidden rounded-xl border opacity-[calc(1-0.1*var(--nested-dialogs))] transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform outline-none not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-xl data-ending-style:scale-98 data-ending-style:opacity-0 data-nested:data-ending-style:translate-y-8 data-nested-dialog-open:origin-top data-starting-style:scale-98 data-nested:data-starting-style:translate-y-8 data-nested:data-starting-style:opacity-0 **:data-[slot=scroll-area-viewport]:data-has-overflow-y:pe-1",
            className,
          )}
          data-slot="command-dialog-popup"
          {...props}
        >
          {children}
        </CommandDialogPrimitive.Popup>
      </CommandDialogViewport>
    </CommandDialogPortal>
  )
}
