"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useRecordWorkspaceAccessEvent } from "@/hooks/api/workspace-access-events/use-record-workspace-access-event"
import { ApiError } from "@/api/client"

import { getWorkspaceEntryID } from "@/lib/workspace-entry-id"

export function WorkspaceAccessGate({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const workspaceEntry = useRecordWorkspaceAccessEvent()
  const entry = useRef<string | null>(null)
  const error = workspaceEntry.error
  const isUnauthenticated = error instanceof ApiError && error.status === 401
  const isForbidden = error instanceof ApiError && error.status === 403
  const isNotProvisioned = error instanceof ApiError && error.code === "user_not_provisioned"

  useEffect(() => {
    if (entry.current) {
      return
    }

    const entryID = getWorkspaceEntryID("app")
    entry.current = entryID
    workspaceEntry.mutate({ workspace: "app", entryID })
  }, [workspaceEntry.mutate])

  useEffect(() => {
    if (!isUnauthenticated || !pathname) {
      return
    }

    const returnTo = new URL(pathname, window.location.origin).toString()
    router.replace(`/login?${new URLSearchParams({ returnTo }).toString()}`)
  }, [isUnauthenticated, pathname, router])

  if (isUnauthenticated) {
    return null
  }

  if (isForbidden) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-foreground text-lg font-medium">
          {isNotProvisioned
            ? "Churchbase access isn't set up"
            : "You don't have access to this workspace"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          {isNotProvisioned
            ? "Your sign-in isn't linked to a Churchbase account. Ask your administrator to provision access."
            : "Your account isn't permitted to enter this workspace."}
        </p>
      </main>
    )
  }

  return children
}
