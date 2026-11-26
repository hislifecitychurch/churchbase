"use client"

import * as React from "react"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@packages/ui-w/lib/utils"

export function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.Image.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Image
      className={cn("size-full object-cover", className)}
      data-slot="avatar-image"
      {...props}
    />
  )
}
