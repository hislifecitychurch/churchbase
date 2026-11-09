"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useAccessContexts } from "@/hooks/api/access-contexts/use-access-contexts"
import { useRecordWorkspaceAccessEvent } from "@/hooks/api/workspace-access-events/use-record-workspace-access-event"
import { ApiError } from "@/api/client"
import {
  getAccessContextForPath,
  canAccessPath,
  isConfiguredAccessPath,
  contextHomePath,
  pathWithContext,
} from "@/lib/access-contexts"
import { getWorkspaceEntryID } from "@/lib/workspace-entry-id"

export function WorkspaceAccessGate({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const contextID = searchParams.get("context_id")
  const accessContexts = useAccessContexts()
  const contexts = accessContexts.data?.contexts ?? []
  const globalRole = accessContexts.data?.global_roles ?? null
  const activeContext = getAccessContextForPath(contexts, pathname, contextID, globalRole)
  const isPathAllowed = canAccessPath(contexts, pathname, contextID, globalRole)
  const isConfiguredPath = isConfiguredAccessPath(pathname)
  const defaultContext = contexts.find((context) => context.kind === "church") ?? contexts[0]
  const redirectContext = activeContext ?? defaultContext
  const isUnauthenticated =
    accessContexts.error instanceof ApiError && accessContexts.error.status === 401
  const isAccessContextForbidden =
    accessContexts.error instanceof ApiError && accessContexts.error.status === 403
  const workspaceEntry = useRecordWorkspaceAccessEvent()
  const entry = useRef<string | null>(null)
  const error = workspaceEntry.error
  const isEventUnauthenticated = error instanceof ApiError && error.status === 401
  const isEventForbidden = error instanceof ApiError && error.status === 403
  const isNotProvisioned =
    (accessContexts.error instanceof ApiError &&
      accessContexts.error.code === "user_not_provisioned") ||
    (error instanceof ApiError && error.code === "user_not_provisioned")
  const hasVerifiedRoute = accessContexts.isSuccess && isConfiguredPath && isPathAllowed

  useEffect(() => {
    if (!pathname || accessContexts.isPending || accessContexts.isError) {
      return
    }
    if (isConfiguredPath && isPathAllowed && activeContext && contextID !== activeContext.id) {
      router.replace(pathWithContext(pathname, activeContext.id, searchParams.toString()))
      return
    }
    if (isConfiguredPath && !isPathAllowed && contexts.length > 0 && redirectContext) {
      router.replace(pathWithContext(contextHomePath(redirectContext), redirectContext.id))
    }
  }, [
    accessContexts.isError,
    accessContexts.isPending,
    activeContext,
    contextID,
    contexts.length,
    redirectContext,
    isPathAllowed,
    isConfiguredPath,
    pathname,
    router,
  ])

  useEffect(() => {
    if (!hasVerifiedRoute || entry.current) {
      return
    }

    const entryID = getWorkspaceEntryID("app")
    entry.current = entryID
    workspaceEntry.mutate({ workspace: "app", entryID })
  }, [hasVerifiedRoute, workspaceEntry.mutate])

  useEffect(() => {
    if ((!isUnauthenticated && !isEventUnauthenticated) || !pathname) {
      return
    }

    const returnTo = new URL(pathname, window.location.origin)
    const query = searchParams.toString()
    if (query) {
      returnTo.search = query
    }
    router.replace(`/login?${new URLSearchParams({ returnTo: returnTo.toString() }).toString()}`)
  }, [isEventUnauthenticated, isUnauthenticated, pathname, router, searchParams])

  if (isUnauthenticated || isEventUnauthenticated || accessContexts.isPending) {
    return null
  }

  if (isAccessContextForbidden || isEventForbidden) {
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

  if (accessContexts.isError) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-foreground text-lg font-medium">Access couldn't be verified</h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          Try again shortly. The workspace remains locked until access can be verified.
        </p>
      </main>
    )
  }

  if (contexts.length === 0 && !globalRole && isConfiguredPath && pathname !== "/settings") {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-foreground text-lg font-medium">No workspace access</h1>
        <p className="text-muted-foreground max-w-sm text-sm" role="alert">
          Ask a church administrator to assign you to a Church-wide or ministry workspace.
        </p>
      </main>
    )
  }

  if (isConfiguredPath && !isPathAllowed) {
    return null
  }

  return children
}
