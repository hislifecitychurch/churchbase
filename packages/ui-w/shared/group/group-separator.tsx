"use client"

import type * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

import { Separator } from "@packages/ui-w/shared/separator/separator"

export function GroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: {
  className?: string
} & React.ComponentProps<typeof Separator>): React.ReactElement {
  return (
    <Separator
      className={cn(
        "bg-input has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:bg-ring dark:before:bg-input/32 [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+&,[data-slot=number-field]:focus-within+input+&]:bg-ring pointer-events-none relative z-2 before:absolute before:inset-0 has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-x-px [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-x-px",
        className,
      )}
      orientation={orientation}
      {...props}
    />
  )
}
