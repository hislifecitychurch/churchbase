"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useAccessContexts } from "@/hooks/api/access-contexts/use-access-contexts"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"

import { accessCapabilities } from "@/lib/access-capabilities"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"
import { MinistrySwitcher } from "@/components/shared/_sidebar/_switcher/ministry-switcher"
import { getMainMenuItems } from "@/data/menu"
import { getMinistrySlugFromPath } from "@/lib/menu/get-ministry-slug-from-path"
import { contextHomePath, getAccessContextForPath, pathWithContext } from "@/lib/access-contexts"

export function MainSidebar(): React.ReactElement {
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
        {accessContexts.isPending || contexts.length > 0 || globalRole ? (
          <SidebarHeader>
            {contexts.length > 0 ? (
              <MinistrySwitcher
                contexts={contexts}
                activeContextID={activeContext?.id ?? null}
                onContextChange={(context) =>
                  router.push(pathWithContext(contextHomePath(context), context.id))
                }
              />
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg" tooltip="Churchbase App">
                    <Link href="/" prefetch={false}>
                      <Image
                        src="/logo/churchbase-light-transparent.webp"
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 shrink-0 object-contain dark:hidden"
                      />
                      <Image
                        src="/logo/churchbase-dark-transparent.webp"
                        alt=""
                        width={32}
                        height={32}
                        className="hidden size-8 shrink-0 object-contain dark:block"
                      />
                      <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-medium">Churchbase</span>
                        <span className="text-muted-foreground truncate text-xs">App</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
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
