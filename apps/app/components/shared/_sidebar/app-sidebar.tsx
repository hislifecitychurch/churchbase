"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useAccessContexts } from "@/hooks/api/access-contexts/use-access-contexts"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"

import { accessCapabilities } from "@/lib/access-capabilities"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"
import { MinistrySwitcher } from "@/components/shared/_sidebar/_switcher/ministry-switcher"
import { getMainMenuItems } from "@/data/menu"
import { getMinistrySlugFromPath } from "@/lib/menu/get-ministry-slug-from-path"
import { contextHomePath, getAccessContextForPath, pathWithContext } from "@/lib/access-contexts"

export function AppSidebar(): React.ReactElement {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessContexts = useAccessContexts()
  const contexts = accessContexts.data?.contexts ?? []
  const globalRole = accessContexts.data?.global_roles ?? null
  const activeContext = getAccessContextForPath(
    contexts,
    pathname,
    searchParams.get("context_id"),
    globalRole,
  )
  const capabilities = globalRole ? accessCapabilities : (activeContext?.capabilities ?? [])
  const ministrySlug = activeContext?.slug ?? getMinistrySlugFromPath(pathname)
  const menuItems = getMainMenuItems(ministrySlug, capabilities)

  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        {contexts.length > 0 || globalRole ? (
          <SidebarHeader>
            <MinistrySwitcher
              contexts={contexts}
              globalRole={globalRole}
              activeContextID={activeContext?.id ?? null}
              onContextChange={(context) =>
                router.push(pathWithContext(contextHomePath(context), context.id))
              }
            />
          </SidebarHeader>
        ) : null}
        <SidebarContent>
          <MainMenu items={menuItems} contextID={activeContext?.id} />
        </SidebarContent>
        <SidebarFooter>
          <FooterMenu
            capabilities={globalRole ? accessCapabilities : (activeContext?.capabilities ?? [])}
            contextID={activeContext?.id}
          />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
