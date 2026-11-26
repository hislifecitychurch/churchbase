"use client"

import * as React from "react"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@packages/ui-w/lib/utils"

export function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Fallback
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}
