"use client"

import type * as React from "react"

import { Button } from "@packages/ui-w/shared/button/button"

type WorkspaceSwitchAccountButtonProps = {
  isPending: boolean
  onSwitchAccount: () => void
}

export function WorkspaceSwitchAccountButton({
  isPending,
  onSwitchAccount,
}: WorkspaceSwitchAccountButtonProps): React.ReactElement {
  return (
    <Button
      aria-busy={isPending}
      className="h-auto p-0 font-normal"
      disabled={isPending}
      onClick={onSwitchAccount}
      size="sm"
      type="button"
      variant="link"
    >
      {isPending ? "Signing out…" : "Not you? Sign out"}
    </Button>
  )
}
