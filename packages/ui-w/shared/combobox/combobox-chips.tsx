"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@packages/ui-w/lib/utils"
import { ComboboxContext } from "@packages/ui-w/contexts/combobox-context"

export function ComboboxChips({
  className,
  children,
  startAddon,
  ...props
}: ComboboxPrimitive.Chips.Props & {
  startAddon?: React.ReactNode
}): React.ReactElement {
  const { chipsRef } = React.useContext(ComboboxContext)

  return (
    <ComboboxPrimitive.Chips
      className={cn(
        "border-input bg-background ring-ring/24 focus-within:border-ring has-aria-invalid:border-destructive/36 has-autofill:bg-foreground/4 focus-within:has-aria-invalid:border-destructive/64 focus-within:has-aria-invalid:ring-destructive/16 dark:not-has-disabled:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 relative inline-flex min-h-9 w-full flex-wrap gap-1 rounded-xl border p-[calc(--spacing(1)-1px)] text-base outline-none *:min-h-7 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-xl focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-64 has-data-[size=lg]:min-h-10 has-data-[size=lg]:*:min-h-8 has-data-[size=sm]:min-h-8 has-data-[size=sm]:*:min-h-6 sm:min-h-8 sm:text-sm sm:*:min-h-6 sm:has-data-[size=lg]:min-h-9 sm:has-data-[size=lg]:*:min-h-7 sm:has-data-[size=sm]:min-h-7 sm:has-data-[size=sm]:*:min-h-5",
        className,
      )}
      data-slot="combobox-chips"
      ref={chipsRef as React.Ref<HTMLDivElement> | null}
      {...props}
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center ps-2 opacity-80 has-[+[data-slot=combobox-chip]]:pe-2 has-[~[data-size=sm]]:ps-1.5 has-[~[data-size=sm]]:has-[+[data-slot=combobox-chip]]:pe-1.5 [&_svg]:pointer-events-none [&_svg]:-ms-0.5 [&_svg]:-me-1.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
          data-slot="combobox-start-addon"
        >
          {startAddon}
        </div>
      )}
      {children}
    </ComboboxPrimitive.Chips>
  )
}
