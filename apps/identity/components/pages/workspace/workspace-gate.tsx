"use client"

import type { JSX } from "react"
import { useEffect } from "react"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { ApiError } from "@/api/client"

import { Button } from "@packages/ui-w/shared/button/button"

import { AppWorkspaceCard } from "@/components/pages/workspace/_card/app-workspace-card"
import { PlatformWorkspaceCard } from "@/components/pages/workspace/_card/platform-workspace-card"

type WorkspaceGateProps = {
  returnTo: string
}

export function WorkspaceGate({ returnTo }: WorkspaceGateProps): JSX.Element {
  const currentUser = useCurrentUser()
  const isUnauthenticated =
    currentUser.error instanceof ApiError && currentUser.error.status === 401
  const isRegularUser = currentUser.data?.platform_role === null

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

  if (currentUser.isPending || isUnauthenticated || isRegularUser) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground text-sm" role="status">
          Checking your account…
        </p>
      </main>
    )
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
          <PlatformWorkspaceCard />
          <AppWorkspaceCard returnTo={returnTo} />
        </div>
      </div>
    </main>
  )
}
