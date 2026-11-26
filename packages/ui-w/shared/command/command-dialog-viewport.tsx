"use client"

import * as React from "react"
import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@packages/ui-w/lib/utils"

export function CommandDialogViewport({
  className,
  ...props
}: CommandDialogPrimitive.Viewport.Props): React.ReactElement {
  return (
    <CommandDialogPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]",
        className,
      )}
      data-slot="command-dialog-viewport"
      {...props}
    />
  )
}
