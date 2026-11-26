"use client"

import type * as React from "react"

import { Avatar } from "@packages/ui-w/shared/avatar/avatar"
import { AvatarFallback } from "@packages/ui-w/shared/avatar/avatar-fallback"

type WorkspaceUserAvatarProps = {
  name: string
}

export function WorkspaceUserAvatar({ name }: WorkspaceUserAvatarProps): React.ReactElement {
  const initial = name.trim().charAt(0).toUpperCase() || "U"

  return (
    <Avatar aria-hidden className="size-8">
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  )
}
