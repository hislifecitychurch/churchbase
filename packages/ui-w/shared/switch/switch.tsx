"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@packages/ui-w/lib/utils"

export function Switch({
  className,
  icon,
  ...props
}: SwitchPrimitive.Root.Props & { icon?: React.ReactNode }): React.ReactElement {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "group focus-visible:ring-ring focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 cursor-pointer items-center rounded-full p-px transition-[background-color] duration-200 outline-none [--thumb-size:--spacing(5)] focus-visible:ring-2 focus-visible:ring-offset-1 data-disabled:cursor-not-allowed data-disabled:opacity-64 sm:[--thumb-size:--spacing(4)]",
        className,
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-background pointer-events-none relative block aspect-square h-full origin-left overflow-hidden rounded-full will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:rounded-full in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-x-110 data-checked:origin-[var(--thumb-size)_50%] data-checked:translate-x-[calc(var(--thumb-size)-4px)]",
        )}
        data-slot="switch-thumb"
      >
        {icon && (
          <span className="text-primary pointer-events-none flex size-full items-center justify-center opacity-0 transition-opacity duration-200 group-data-checked:opacity-100">
            <span className="size-3.5">{icon}</span>
          </span>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}
