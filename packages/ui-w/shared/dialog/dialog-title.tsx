"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@packages/ui-w/lib/utils"

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props): React.ReactElement {
  return (
    <DialogPrimitive.Title
      className={cn("text-xl leading-none font-medium", className)}
      data-slot="dialog-title"
      {...props}
    />
  )
}
