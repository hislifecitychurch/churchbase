"use client"

import * as React from "react"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@packages/ui-w/lib/utils"

export function Avatar({ className, ...props }: AvatarPrimitive.Root.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "bg-background inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full align-middle text-xs font-medium select-none",
        className,
      )}
      data-slot="avatar"
      {...props}
    />
  )
}
