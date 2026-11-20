"use client"

import { IconLogout } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"

import { env } from "@/lib/env"

export function SignOutMenuItem(): React.ReactElement {
  const handleSignOut = () => {
    const identityURL = env.NEXT_PUBLIC_IDENTITY_URL
    window.location.assign(identityURL ? `${identityURL.replace(/\/+$/, "")}/sign-out` : "/login")
  }

  return (
    <MenuItem onClick={handleSignOut}>
      <IconLogout />
      Sign out
    </MenuItem>
  )
}
