"use client"

import type * as React from "react"

import { Button } from "@packages/ui-w/shared/button/button"

type WorkspaceSignOutButtonProps = {
  isPending: boolean
  onSignOut: () => void
}

export function WorkspaceSignOutButton({
  isPending,
  onSignOut,
}: WorkspaceSignOutButtonProps): React.ReactElement {
  return (
    <Button
      aria-busy={isPending}
      className="h-auto p-0 font-normal"
      disabled={isPending}
      onClick={onSignOut}
      size="sm"
      type="button"
      variant="link"
    >
      {isPending ? "Signing out…" : "Not you? Sign out"}
    </Button>
  )
}
