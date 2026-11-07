"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { useRecordWorkspaceAccessEvent } from "@/hooks/api/workspace-access-events/use-record-workspace-access-event"
import { ApiError } from "@/api/client"

import { Button } from "@packages/ui-w/shared/button/button"

import { getWorkspaceEntryID } from "@/lib/workspace-entry-id"

export function CurrentUserGate({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const query = useCurrentUser()
  const workspaceEntry = useRecordWorkspaceAccessEvent()
  const entry = useRef<{ userID: string; entryID: string } | null>(null)
  const isUnauthenticated = query.error instanceof ApiError && query.error.status === 401

  useEffect(() => {
    if (isUnauthenticated) {
      entry.current = null
      return
    }
    if (!query.isSuccess || !query.data || entry.current?.userID === query.data.id) {
      return
    }

    const entryID = getWorkspaceEntryID(query.data.id, "app")
    entry.current = { userID: query.data.id, entryID }
    workspaceEntry.mutate({ workspace: "app", entryID })
  }, [isUnauthenticated, query.data?.id, query.isSuccess, workspaceEntry.mutate])

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
      query.error instanceof ApiError && query.error.code === "user_not_provisioned"

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
