"use client"

import type * as React from "react"

import { useSignOut } from "@/hooks/api/auth/use-sign-out"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"

type WorkspaceUserMenuSignOutMenuItemProps = {
  onError: () => void
}

export function WorkspaceUserMenuSignOutMenuItem({
  onError,
}: WorkspaceUserMenuSignOutMenuItemProps): React.ReactElement {
  const signOutMutation = useSignOut()

  function handleSignOut(): void {
    void signOutMutation
      .mutateAsync()
      .then(() => window.location.replace("/login"))
      .catch(onError)
  }

  return (
    <MenuItem disabled={signOutMutation.isPending} onClick={handleSignOut}>
      {signOutMutation.isPending ? "Signing out…" : "Sign out"}
    </MenuItem>
  )
}
