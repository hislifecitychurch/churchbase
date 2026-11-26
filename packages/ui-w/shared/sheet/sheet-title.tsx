"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "@packages/ui-w/lib/utils"

export function SheetTitle({
  className,
  ...props
}: SheetPrimitive.Title.Props): React.ReactElement {
  return (
    <SheetPrimitive.Title
      className={cn("font-heading text-xl leading-none font-medium", className)}
      data-slot="sheet-title"
      {...props}
    />
  )
}
