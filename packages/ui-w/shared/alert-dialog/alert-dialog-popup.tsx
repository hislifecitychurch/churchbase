"use client"

import * as React from "react"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { cn } from "@packages/ui-w/lib/utils"

import { AlertDialogBackdrop } from "@packages/ui-w/shared/alert-dialog/alert-dialog-backdrop"
import { AlertDialogPortal } from "@packages/ui-w/shared/alert-dialog/alert-dialog-portal"
import { AlertDialogViewport } from "@packages/ui-w/shared/alert-dialog/alert-dialog-viewport"

export function AlertDialogPopup({
  className,
  bottomStickOnMobile = true,
  portalProps,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  bottomStickOnMobile?: boolean
  portalProps?: AlertDialogPrimitive.Portal.Props
}): React.ReactElement {
  return (
    <AlertDialogPortal {...portalProps}>
      <AlertDialogBackdrop />
      <AlertDialogViewport
        className={cn(bottomStickOnMobile && "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12")}
      >
        <AlertDialogPrimitive.Popup
          className={cn(
            "bg-popover border-border text-popover-foreground relative row-start-2 flex max-h-full min-h-0 w-full max-w-lg min-w-0 origin-center flex-col overflow-hidden rounded-xl border opacity-[calc(1-var(--nested-dialogs))] transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-xl data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-98 sm:data-starting-style:scale-98",
            bottomStickOnMobile &&
              "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-t-xl max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:before:hidden max-sm:before:rounded-t-xl max-sm:before:rounded-b-none max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4",
            className,
          )}
          data-slot="alert-dialog-popup"
          {...props}
        />
      </AlertDialogViewport>
    </AlertDialogPortal>
  )
}
