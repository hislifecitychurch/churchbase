"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@packages/ui-w/shared/button/button"

type CurrentUser = {
  id: string
  platform_role: string | null
  profile: {
    first_name: string | null
    last_name: string | null
  }
}

type APIErrorEnvelope = {
  errors?: { code?: unknown }[]
  success?: unknown
  data?: unknown
}

class CurrentUserRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code?: string,
  ) {
    super("Could not load the current Churchbase user")
  }
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const user = value as Record<string, unknown>
  const profile = user.profile

  if (typeof profile !== "object" || profile === null) {
    return false
  }

  const names = profile as Record<string, unknown>
  return (
    typeof user.id === "string" &&
    (user.platform_role === null || typeof user.platform_role === "string") &&
    (names.first_name === null || typeof names.first_name === "string") &&
    (names.last_name === null || typeof names.last_name === "string")
  )
}

async function getCurrentUser(): Promise<CurrentUser> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL_V1

  if (!apiURL) {
    throw new CurrentUserRequestError(0, "api_url_missing")
  }

  const response = await fetch(`${apiURL.replace(/\/+$/, "")}/users/me`, {
    cache: "no-store",
    credentials: "include",
  })
  const body = (await response.json().catch(() => null)) as APIErrorEnvelope | null
  const code = typeof body?.errors?.[0]?.code === "string" ? body.errors[0].code : undefined

  if (!response.ok || body?.success !== true || !isCurrentUser(body.data)) {
    throw new CurrentUserRequestError(response.status, code)
  }

  return body.data
}

export function CurrentUserGate({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  })
  const isUnauthenticated =
    query.error instanceof CurrentUserRequestError && query.error.status === 401

  useEffect(() => {
    if (!isUnauthenticated || !pathname) {
      return
    }

    const returnTo = new URL(pathname, window.location.origin).toString()
    router.replace(`/login?${new URLSearchParams({ returnTo }).toString()}`)
  }, [isUnauthenticated, pathname, router])

  if (query.isPending || isUnauthenticated) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground text-sm" role="status">
          Checking your account…
        </p>
      </main>
    )
  }

  if (query.isError) {
    const isNotProvisioned =
      query.error instanceof CurrentUserRequestError && query.error.code === "user_not_provisioned"

    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-foreground text-lg font-medium">
          {isNotProvisioned ? "Churchbase access isn't set up" : "We couldn't verify your session"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          {isNotProvisioned
            ? "Your sign-in isn't linked to a Churchbase account. Ask your administrator to provision access."
            : "Churchbase couldn't verify your account right now. Please try again."}
        </p>
        {!isNotProvisioned && (
          <Button disabled={query.isFetching} onClick={() => void query.refetch()} type="button">
            {query.isFetching ? "Checking…" : "Try again"}
          </Button>
        )}
      </main>
    )
  }

  return query.data ? children : null
}
