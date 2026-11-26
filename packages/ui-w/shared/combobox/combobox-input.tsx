"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { IconSelector, IconX } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Input } from "@packages/ui-w/shared/input/input"
import { ComboboxTrigger } from "@packages/ui-w/shared/combobox/combobox-trigger"
import { ComboboxClear } from "@packages/ui-w/shared/combobox/combobox-clear"

export function ComboboxInput({
  className,
  showTrigger = true,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  showTrigger?: boolean
  showClear?: boolean
  startAddon?: React.ReactNode
  size?: "sm" | "default" | "lg" | number
  ref?: React.Ref<HTMLInputElement>
  triggerProps?: ComboboxPrimitive.Trigger.Props
  clearProps?: ComboboxPrimitive.Clear.Props
}): React.ReactElement {
  const sizeValue = (size ?? "default") as "sm" | "default" | "lg" | number

  return (
    <ComboboxPrimitive.InputGroup
      className="text-foreground relative w-full not-has-[>*.w-full]:w-fit has-disabled:opacity-64"
      data-slot="combobox-input-group"
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 inset-s-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
          data-slot="combobox-start-addon"
        >
          {startAddon}
        </div>
      )}
      <ComboboxPrimitive.Input
        className={cn(
          startAddon &&
            "*:data-[slot=combobox-input]:ps-[calc(--spacing(8.5)-1px)] data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7.5)-1px)] sm:*:data-[slot=combobox-input]:ps-[calc(--spacing(8)-1px)] sm:data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7)-1px)]",
          sizeValue === "sm"
            ? "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-6.5"
            : "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-7",
          className,
        )}
        data-slot="combobox-input"
        render={<Input className="has-disabled:opacity-100" nativeInput size={sizeValue} />}
        {...props}
      />
      {showTrigger && (
        <ComboboxTrigger
          className={cn(
            "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border border-transparent opacity-80 transition-opacity outline-none hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
            sizeValue === "sm" ? "inset-e-0" : "inset-e-0.5",
          )}
          {...triggerProps}
        >
          <ComboboxPrimitive.Icon data-slot="combobox-icon">
            <IconSelector />
          </ComboboxPrimitive.Icon>
        </ComboboxTrigger>
      )}
      {showClear && (
        <ComboboxClear
          className={cn(
            "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border border-transparent opacity-80 transition-opacity outline-none hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
            sizeValue === "sm" ? "inset-e-0" : "inset-e-0.5",
          )}
          {...clearProps}
        >
          <IconX />
        </ComboboxClear>
      )}
    </ComboboxPrimitive.InputGroup>
  )
}
