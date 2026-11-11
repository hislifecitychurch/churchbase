"use client"

import { useEffect } from "react"
import type { JSX, ReactNode } from "react"
import { IconMenu2 } from "@tabler/icons-react"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { ApiError } from "@/api/client"

import { useSidebar } from "@packages/ui-w/hooks/use-sidebar"
import { Button } from "@packages/ui-w/shared/button/button"
import { SidebarProvider } from "@packages/ui-w/providers/sidebar-provider"
import { SidebarInset } from "@packages/ui-w/shared/sidebar/sidebar-inset"

import { PlatformSidebar } from "@/components/shared/_sidebar/platform-sidebar"

type PlatformShellProps = {
  children: ReactNode
  sidebarOpen: boolean
}

function MobileNavTrigger(): JSX.Element {
  const { setOpenMobile } = useSidebar()

  return (
    <Button
      aria-label="Open navigation"
      onClick={() => setOpenMobile(true)}
      size="icon-lg"
      variant="ghost"
    >
      <IconMenu2 aria-hidden />
    </Button>
  )
}

export function PlatformShell({ children, sidebarOpen }: PlatformShellProps): JSX.Element {
  const currentUser = useCurrentUser()
  const isUnauthenticated =
    currentUser.error instanceof ApiError && currentUser.error.status === 401
  const hasGlobalRole =
    currentUser.data?.global_roles === "admin" || currentUser.data?.global_roles === "staff"

  useEffect(() => {
    if (!isUnauthenticated) {
      return
    }

    const loginURL = new URL("/login", window.location.origin)
    loginURL.searchParams.set("returnTo", window.location.href)
    window.location.replace(loginURL.toString())
  }, [isUnauthenticated])

  if (currentUser.isPending || isUnauthenticated) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground text-sm" role="status">
          Verifying your platform access…
        </p>
      </main>
    )
  }

  if (currentUser.isError) {
    const notProvisioned =
      currentUser.error instanceof ApiError && currentUser.error.code === "user_not_provisioned"
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-foreground text-xl font-medium">
          {notProvisioned ? "Churchbase access isn't set up" : "We couldn't verify your session"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          {notProvisioned
            ? "Your sign-in isn't linked to a Churchbase account. Ask your administrator to provision access."
            : "Churchbase couldn't verify your account right now. Please try again."}
        </p>
        <Button onClick={() => void currentUser.refetch()} type="button">
          Try again
        </Button>
      </main>
    )
  }

  if (!hasGlobalRole) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-foreground text-xl font-medium">Platform access is restricted</h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          This workspace is for Global Admin and Global Staff accounts.
        </p>
      </main>
    )
  }

  return (
    <SidebarProvider className="items-start" defaultOpen={sidebarOpen}>
      <PlatformSidebar />
      <SidebarInset className="min-h-0 gap-0 self-stretch p-4 sm:p-6">
        <header className="flex items-center md:hidden">
          <MobileNavTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
