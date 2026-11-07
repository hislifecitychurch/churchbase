"use client"

import type { JSX } from "react"
import { use, useEffect } from "react"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"

import { ApiError } from "@/api/client"

import { getConfiguredReturnURL } from "@/lib/return-url"

import { Button } from "@packages/ui-w/shared/button/button"
import { Card } from "@packages/ui-w/shared/card/card"
import { Skeleton } from "@packages/ui-w/shared/skeleton/skeleton"

import { AppWorkspaceCard } from "@/components/pages/workspace/_card/app-workspace-card"
import { PlatformWorkspaceCard } from "@/components/pages/workspace/_card/platform-workspace-card"

type WorkspacePageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>
}

export default function WorkspacePage({ searchParams }: WorkspacePageProps): JSX.Element | null {
  const params = use(searchParams)
  const returnTo = getConfiguredReturnURL(
    typeof params.returnTo === "string" ? params.returnTo : undefined,
  )
  const currentUser = useCurrentUser()
  const isUnauthenticated =
    currentUser.error instanceof ApiError && currentUser.error.status === 401
  const isRegularUser = currentUser.data?.platform_role === null
  const lastUsedWorkspace = currentUser.data?.last_workspace_access?.workspace

  useEffect(() => {
    if (!isUnauthenticated) {
      return
    }

    const loginURL = new URL("/login", window.location.origin)
    loginURL.searchParams.set("returnTo", returnTo)
    window.location.replace(loginURL.toString())
  }, [isUnauthenticated, returnTo])

  useEffect(() => {
    if (isRegularUser) {
      window.location.replace(returnTo)
    }
  }, [isRegularUser, returnTo])

  if (currentUser.isPending) {
    return (
      <>
        <span className="sr-only" role="status">
          Verifying workspace access
        </span>
        <main
          aria-busy="true"
          className="flex min-h-svh flex-col items-center justify-center px-6 py-16"
        >
          <div className="flex w-full max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <Skeleton aria-hidden="true" className="mx-auto h-8 w-48 max-w-full" />
              <Skeleton aria-hidden="true" className="mx-auto h-4 w-64 max-w-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <Card aria-hidden="true" className="justify-between gap-6 p-4 sm:p-6" key={index}>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <Skeleton className="h-11 w-full" />
                </Card>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  if (isUnauthenticated || isRegularUser) {
    return null
  }

  if (currentUser.isError) {
    const notProvisioned =
      currentUser.error instanceof ApiError && currentUser.error.code === "user_not_provisioned"

    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-foreground text-xl font-normal">
          {notProvisioned ? "Churchbase access isn't set up" : "We couldn't verify your session"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          {notProvisioned
            ? "Your sign-in isn't linked to a Churchbase account. Ask your administrator to provision access."
            : "Churchbase couldn't verify your account right now. Please try again."}
        </p>
        <Button onClick={() => window.location.reload()} type="button">
          Try again
        </Button>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-foreground text-2xl font-normal">Choose your workspace</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Choose where you want to work today.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformWorkspaceCard isLastUsed={lastUsedWorkspace === "platform"} />
          <AppWorkspaceCard isLastUsed={lastUsedWorkspace === "app"} returnTo={returnTo} />
        </div>
      </div>
    </main>
  )
}
