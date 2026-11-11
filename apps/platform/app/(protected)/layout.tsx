import { cookies } from "next/headers"
import type { JSX, ReactNode } from "react"

import { SIDEBAR_COOKIE_NAME } from "@packages/ui-w/lib/constants"

import { PlatformShell } from "@/components/shared/platform-shell"

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>): Promise<JSX.Element> {
  const cookieStore = await cookies()
  const sidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false"

  return <PlatformShell sidebarOpen={sidebarOpen}>{children}</PlatformShell>
}
