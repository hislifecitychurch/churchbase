"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { ApiError } from "@/api/client"
import { getSessionVerificationAction } from "@/lib/auth-recovery"

import { toastManager } from "@packages/ui-w/providers/toast-provider"
import { Button } from "@packages/ui-w/shared/button/button"
import { Skeleton } from "@packages/ui-w/shared/skeleton/skeleton"

const AUTH_TOAST_ID = "platform-auth-verification"

export function PlatformAccessGate({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const currentUser = useCurrentUser()
  const retryAttempts = useRef(0)
  const isUnauthenticated =
    currentUser.error instanceof ApiError && currentUser.error.status === 401
  const notProvisioned =
    currentUser.error instanceof ApiError && currentUser.error.code === "user_not_provisioned"
  const isVerificationFailure = currentUser.isError && !isUnauthenticated && !notProvisioned
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

  useEffect(() => {
    if (currentUser.isSuccess) {
      retryAttempts.current = 0
    }

    if (!isVerificationFailure) {
      toastManager.close(AUTH_TOAST_ID)
      return
    }

    const action = getSessionVerificationAction(retryAttempts.current)
    const signIn = action === "sign-in"

    toastManager.add({
      id: AUTH_TOAST_ID,
      type: "error",
      timeout: 0,
      title: "We couldn't verify your session",
      description: signIn
        ? "We're still having trouble. Sign in again to continue."
        : "The authentication service is temporarily unavailable. Please try again.",
      actionProps: {
        children: signIn ? "Sign in" : "Retry",
        onClick: () => {
          toastManager.close(AUTH_TOAST_ID)
          if (signIn) {
            const loginURL = new URL("/login", window.location.origin)
            loginURL.searchParams.set("returnTo", window.location.href)
            window.location.replace(loginURL.toString())
            return
          }

          retryAttempts.current += 1
          void currentUser.refetch()
        },
      },
    })
  }, [
    currentUser.error,
    currentUser.isError,
    currentUser.isSuccess,
    currentUser.refetch,
    isVerificationFailure,
  ])

  if (
    isUnauthenticated ||
    (!currentUser.data && (currentUser.isPending || currentUser.isFetching))
  ) {
    return <PlatformAccessSkeleton />
  }

  if (currentUser.isError && notProvisioned) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-foreground text-xl font-medium">Churchbase access isn't set up</h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          Your sign-in isn't linked to a Churchbase account. Ask your administrator to provision
          access.
        </p>
        <Button onClick={() => void currentUser.refetch()} type="button">
          Try again
        </Button>
      </section>
    )
  }

  if (isVerificationFailure && !currentUser.data) {
    return <PlatformAccessSkeleton />
  }

  if (!hasGlobalRole) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-foreground text-xl font-medium">Platform access is restricted</h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          This workspace is for Global Admin and Global Staff accounts.
        </p>
      </section>
    )
  }

  return children
}

function PlatformAccessSkeleton(): React.ReactElement {
  return (
    <div
      aria-busy="true"
      aria-label="Verifying your access"
      className="flex flex-1 flex-col gap-6"
      role="status"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="min-h-48 w-full flex-1" />
    </div>
  )
}
