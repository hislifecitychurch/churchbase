"use client"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"
import { AppLogo } from "@/components/shared/_sidebar/logo-sidebar"
import { mainMenuItems } from "@/data/menu/main"

export function AppSidebar(): React.ReactElement {
  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <AppLogo />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <MainMenu items={mainMenuItems} />
        </SidebarContent>
        <SidebarFooter>
          <FooterMenu />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
