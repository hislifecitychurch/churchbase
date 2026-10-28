"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@packages/ui-w/lib/utils"

export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.Label.Props): React.ReactElement {
  return (
    <SelectPrimitive.Label
      className={cn(
        "text-foreground inline-flex cursor-default items-center gap-2 text-base font-medium not-in-data-[slot=field]:mb-2",
        className,
      )}
      data-slot="select-label"
      {...props}
    />
  )
}
