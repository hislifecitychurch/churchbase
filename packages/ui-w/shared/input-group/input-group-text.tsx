"use client"

import type * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export function InputGroupText({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 truncate [&_svg]:pointer-events-none [&_svg]:-mx-0.5 in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}
