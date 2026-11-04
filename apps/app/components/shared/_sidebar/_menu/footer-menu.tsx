"use client"

import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"
import { SidebarTrigger } from "@packages/ui-w/shared/sidebar/sidebar-trigger"

export function FooterMenu(): React.ReactElement {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarTrigger className="w-full justify-start p-2! text-sm! font-normal! group-data-[collapsible=icon]:justify-center" />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
