"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { ComboboxChipRemove } from "@packages/ui-w/shared/combobox/combobox-chip-remove"

export function ComboboxChip({
  children,
  removeProps,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  removeProps?: ComboboxPrimitive.ChipRemove.Props
}): React.ReactElement {
  return (
    <ComboboxPrimitive.Chip
      className="bg-accent text-accent-foreground flex items-center rounded-xl ps-2 text-sm font-medium outline-none sm:text-xs/(--text-xs--line-height) [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
      data-slot="combobox-chip"
      {...props}
    >
      {children}
      <ComboboxChipRemove {...removeProps} />
    </ComboboxPrimitive.Chip>
  )
}
