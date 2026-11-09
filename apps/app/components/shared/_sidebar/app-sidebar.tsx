"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useAccessContexts } from "@/hooks/api/access-contexts/use-access-contexts"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"
import { MinistrySwitcher } from "@/components/shared/_sidebar/_switcher/ministry-switcher"
import { getMainMenuItems } from "@/data/menu"
import { contextHomePath, getAccessContextForPath, pathWithContext } from "@/lib/access-contexts"

export function AppSidebar(): React.ReactElement {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessContexts = useAccessContexts()
  const contexts = accessContexts.data ?? []
  const activeContext = getAccessContextForPath(contexts, pathname, searchParams.get("context_id"))
  const menuItems = activeContext
    ? getMainMenuItems(activeContext.slug, activeContext.capabilities)
    : []

  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <MinistrySwitcher
            contexts={contexts}
            activeContextID={activeContext?.id ?? null}
            onContextChange={(context) =>
              router.push(pathWithContext(contextHomePath(context), context.id))
            }
          />
        </SidebarHeader>
        <SidebarContent>
          <MainMenu items={menuItems} contextID={activeContext?.id} />
        </SidebarContent>
        <SidebarFooter>
          <FooterMenu
            capabilities={activeContext?.capabilities ?? []}
            contextID={activeContext?.id}
          />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
