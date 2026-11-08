"use client"

import { useMutation } from "@tanstack/react-query"

import { ApiError } from "@/api/client"
import { recordWorkspaceAccessEvent, type Workspace } from "@/api/workspace-access-events"

export function shouldRetryWorkspaceAccessEvent(failureCount: number, error: unknown): boolean {
  return (
    failureCount < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500)
  )
}

export function useRecordWorkspaceAccessEvent() {
  return useMutation({
    mutationFn: ({ workspace, entryID }: { workspace: Workspace; entryID: string }) =>
      recordWorkspaceAccessEvent(workspace, entryID),
    retry: shouldRetryWorkspaceAccessEvent,
  })
}
