"use client"

import { useState } from "react"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"
import { MinistrySwitcher } from "@/components/shared/_sidebar/_switcher/ministry-switcher"
import { mainMenuItems } from "@/data/menu/main"
import { ministries } from "@/data/ministries"

export function AppSidebar(): React.ReactElement {
  const [activeMinistrySlug, setActiveMinistrySlug] = useState(ministries[0].slug)

  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <MinistrySwitcher
            activeSlug={activeMinistrySlug}
            onMinistryChange={setActiveMinistrySlug}
          />
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
