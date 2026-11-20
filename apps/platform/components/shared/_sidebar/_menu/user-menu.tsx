"use client"

import { IconDotsVertical, IconLogout } from "@tabler/icons-react"

import { useSidebar } from "@packages/ui-w/hooks/use-sidebar"
import { Avatar } from "@packages/ui-w/shared/avatar/avatar"
import { AvatarFallback } from "@packages/ui-w/shared/avatar/avatar-fallback"
import { Menu } from "@packages/ui-w/shared/menu/menu"
import { MenuGroup } from "@packages/ui-w/shared/menu/menu-group"
import { MenuGroupLabel } from "@packages/ui-w/shared/menu/menu-group-label"
import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { Skeleton } from "@packages/ui-w/shared/skeleton/skeleton"
import { SpinnerFlicker01 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-01"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"

function formatRole(role: "admin" | "staff" | null | undefined): string {
  if (role === "admin") return "Admin"
  if (role === "staff") return "Staff"
  return "Member"
}

function formatName(firstName?: string | null, lastName?: string | null): string {
  const parts = [firstName, lastName].map((part) => part?.trim()).filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : "User"
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "U"
}

export function UserMenu(): React.ReactElement {
  const { isMobile } = useSidebar()
  const currentUser = useCurrentUser()

  const isLoading = currentUser.isPending
  const userName = formatName(
    currentUser.data?.profile?.first_name,
    currentUser.data?.profile?.last_name,
  )
  const userRole = formatRole(currentUser.data?.global_roles)
  const initial = getInitial(userName)

  const handleSignOut = () => {
    const identityURL = process.env.NEXT_PUBLIC_IDENTITY_URL
    window.location.assign(identityURL ? `${identityURL.replace(/\/+$/, "")}/sign-out` : "/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                size="lg"
                tooltip={isLoading ? "Loading user..." : `${userName} (${userRole})`}
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {isLoading ? <SpinnerFlicker01 className="size-4" /> : initial}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              {isLoading ? (
                <>
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-14" />
                </>
              ) : (
                <>
                  <span className="truncate font-medium">{userName}</span>
                  <span className="text-muted-foreground truncate text-xs">{userRole}</span>
                </>
              )}
            </div>
            <IconDotsVertical className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </MenuTrigger>
          <MenuPopup
            align="end"
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <MenuGroup>
              <MenuGroupLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userName}</span>
                    <span className="text-muted-foreground truncate text-xs">{userRole}</span>
                  </div>
                </div>
              </MenuGroupLabel>
            </MenuGroup>
            <MenuSeparator />
            <MenuItem onClick={handleSignOut}>
              <IconLogout />
              Sign out
            </MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
