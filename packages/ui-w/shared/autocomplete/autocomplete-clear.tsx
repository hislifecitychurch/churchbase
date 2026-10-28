"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { IconX } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

export function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Clear
      className={cn(
        "absolute inset-e-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border border-transparent opacity-80 transition-[color,background-color,opacity] outline-none hover:opacity-100 sm:size-7 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="autocomplete-clear"
      {...props}
    >
      <IconX />
    </AutocompletePrimitive.Clear>
  )
}
