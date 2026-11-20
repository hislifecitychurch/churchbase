"use client"

import { IconDotsVertical } from "@tabler/icons-react"

import { useSidebar } from "@packages/ui-w/hooks/use-sidebar"
import { Avatar } from "@packages/ui-w/shared/avatar/avatar"
import { AvatarFallback } from "@packages/ui-w/shared/avatar/avatar-fallback"
import { Menu } from "@packages/ui-w/shared/menu/menu"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { Skeleton } from "@packages/ui-w/shared/skeleton/skeleton"
import { SpinnerFlicker01 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-01"

import { UserMenuSignOutMenuItem } from "@/components/shared/_sidebar/_menu/_menu-items/user-menu-sign-out-menu-item"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { formatUserName } from "@/lib/formatter/name/user"

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "U"
}

export function UserMenu(): React.ReactElement {
  const { isMobile } = useSidebar()
  const currentUser = useCurrentUser()

  const isLoading = currentUser.isPending
  const userName = formatUserName(
    currentUser.data?.profile?.first_name,
    currentUser.data?.profile?.last_name,
  )
  const initial = getInitial(userName)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                size="lg"
                tooltip={isLoading ? "Loading user..." : userName}
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
                <Skeleton className="h-3.5 w-24" />
              ) : (
                <span className="truncate font-medium">{userName}</span>
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
            <UserMenuSignOutMenuItem />
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
