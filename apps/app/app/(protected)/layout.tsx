import { cookies } from "next/headers"
import type { JSX, ReactNode } from "react"

import { SIDEBAR_COOKIE_NAME } from "@packages/ui-w/lib/constants"
import { SidebarProvider } from "@packages/ui-w/providers/sidebar-provider"
import { SidebarInset } from "@packages/ui-w/shared/sidebar/sidebar-inset"

import { MobileNavTrigger } from "@/components/shared/_header/mobile-nav-trigger"
import { AppSidebar } from "@/components/shared/_sidebar/app-sidebar"

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>): Promise<JSX.Element> {
  const cookieStore = await cookies()
  const sidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false"

  return (
    <SidebarProvider className="items-start" defaultOpen={sidebarOpen}>
      <AppSidebar />
      <SidebarInset className="min-h-0 gap-0 self-stretch p-4 sm:p-6">
        <header className="flex items-center md:hidden">
          <MobileNavTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
