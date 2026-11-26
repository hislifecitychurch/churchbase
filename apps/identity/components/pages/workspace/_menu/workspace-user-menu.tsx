"use client"

import type * as React from "react"
import { useState } from "react"

import { useAuthSession } from "@/hooks/api/auth/use-auth-session"

import { Button } from "@packages/ui-w/shared/button/button"
import { Menu } from "@packages/ui-w/shared/menu/menu"
import { MenuGroup } from "@packages/ui-w/shared/menu/menu-group"
import { MenuGroupLabel } from "@packages/ui-w/shared/menu/menu-group-label"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"

import { WorkspaceUserAvatar } from "@/components/pages/workspace/_avatar/workspace-user-avatar"
import { WorkspaceUserMenuSignOutMenuItem } from "@/components/pages/workspace/_menu/_menu-item/workspace-user-menu-sign-out-menu-item"

export function WorkspaceUserMenu(): React.ReactElement {
  const session = useAuthSession()
  const [open, setOpen] = useState(false)
  const [signOutError, setSignOutError] = useState(false)
  const user = session.data?.user
  const name = user?.name.trim() || user?.email || "Signed-in account"

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSignOutError(false)
    }
  }

  function handleSignOutError(): void {
    setSignOutError(true)
    setOpen(true)
  }

  return (
    <div className="fixed top-4 right-4 z-20 sm:top-6 sm:right-6">
      <Menu onOpenChange={handleOpenChange} open={open}>
        <MenuTrigger
          render={
            <Button
              aria-label={`Account menu for ${name}`}
              className="rounded-full"
              size="icon-xl"
              type="button"
              variant="ghost"
            />
          }
        >
          <WorkspaceUserAvatar name={name} />
        </MenuTrigger>
        <MenuPopup align="end" className="min-w-56 rounded-lg" sideOffset={4}>
          <MenuGroup>
            <MenuGroupLabel className="text-foreground flex flex-col items-start gap-0.5">
              <span className="max-w-48 truncate">{name}</span>
              {user?.email && user.email !== name ? (
                <span className="text-muted-foreground max-w-48 truncate font-normal">
                  {user.email}
                </span>
              ) : null}
            </MenuGroupLabel>
          </MenuGroup>
          <MenuSeparator />
          <WorkspaceUserMenuSignOutMenuItem onError={handleSignOutError} />
          {signOutError ? (
            <p className="text-destructive px-2 py-1 text-xs" role="alert">
              We couldn&apos;t sign you out. Please try again.
            </p>
          ) : null}
        </MenuPopup>
      </Menu>
    </div>
  )
}
