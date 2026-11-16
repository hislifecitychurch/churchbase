"use client"

import Image from "next/image"
import Link from "next/link"

import { Sidebar } from "@packages/ui-w/shared/sidebar/sidebar"
import { SidebarContent } from "@packages/ui-w/shared/sidebar/sidebar-content"
import { SidebarFooter } from "@packages/ui-w/shared/sidebar/sidebar-footer"
import { SidebarHeader } from "@packages/ui-w/shared/sidebar/sidebar-header"
import { SidebarMenu } from "@packages/ui-w/shared/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@packages/ui-w/shared/sidebar/sidebar-menu-item"

import { FooterMenu } from "@/components/shared/_sidebar/_menu/footer-menu"
import { MainMenu } from "@/components/shared/_sidebar/_menu/main-menu"

export function MainSidebar(): React.ReactElement {
  return (
    <div className="flex h-svh shrink-0 self-start">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Churchbase Platform">
                <Link href="/" prefetch={false}>
                  <Image
                    src="/logo/churchbase-light-rounded.webp"
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-xl object-cover dark:hidden"
                  />
                  <Image
                    src="/logo/churchbase-dark-rounded.webp"
                    alt=""
                    width={32}
                    height={32}
                    className="hidden size-8 shrink-0 rounded-xl object-cover dark:block"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">Churchbase</span>
                    <span className="text-muted-foreground truncate text-xs">Platform</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <MainMenu />
        </SidebarContent>
        <SidebarFooter>
          <FooterMenu />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
