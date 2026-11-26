"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { type VariantProps } from "class-variance-authority"
import { IconSelector } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"
import { selectTriggerVariants } from "@packages/ui-w/shared/variants"

export const selectTriggerIconClassName = "-me-1 size-4.5 opacity-80 sm:size-4"

export function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>): React.ReactElement {
  return (
    <SelectPrimitive.Trigger
      className={cn(selectTriggerVariants({ size }), className)}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon data-slot="select-icon">
        <IconSelector className={selectTriggerIconClassName} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}
