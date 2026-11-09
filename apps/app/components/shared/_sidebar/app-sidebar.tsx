"use client"

import { usePathname, useRouter } from "next/navigation"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"
import { MinistrySwitcher } from "@/components/shared/_sidebar/_switcher/ministry-switcher"
import { getMainMenuItems } from "@/data/menu"
import { getMinistrySlugFromPath } from "@/lib/menu/get-ministry-slug-from-path"

export function AppSidebar(): React.ReactElement {
  const pathname = usePathname()
  const router = useRouter()
  const activeMinistrySlug = getMinistrySlugFromPath(pathname)
  const menuItems = getMainMenuItems(activeMinistrySlug)

  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <MinistrySwitcher
            activeSlug={activeMinistrySlug}
            onMinistryChange={(slug) =>
              router.push(slug === "churchbase" ? "/" : `/ministries/${slug}`)
            }
          />
        </SidebarHeader>
        <SidebarContent>
          <MainMenu items={menuItems} />
        </SidebarContent>
        <SidebarFooter>
          <FooterMenu />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
