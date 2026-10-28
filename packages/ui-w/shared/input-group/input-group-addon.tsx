"use client"

import type * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@packages/ui-w/lib/utils"
import { inputGroupAddonVariants } from "@packages/ui-w/shared/variants"

export function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>): React.ReactElement {
  return (
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as Element
        if (!e.currentTarget.contains(target)) return

        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']",
        )
        if (isInteractive) return
        e.preventDefault()
        const parent = e.currentTarget.parentElement
        const input = parent?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          "input, textarea",
        )
        if (input && !parent?.querySelector("input:focus, textarea:focus")) {
          input.focus()
        }
      }}
      {...props}
    />
  )
}
