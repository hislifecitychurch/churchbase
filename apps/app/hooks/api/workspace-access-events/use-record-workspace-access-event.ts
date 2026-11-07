"use client"

import { useMutation } from "@tanstack/react-query"

import { recordWorkspaceAccessEvent, type Workspace } from "@/api/workspace-access-events"

export function useRecordWorkspaceAccessEvent() {
  return useMutation({
    mutationFn: ({ workspace, entryID }: { workspace: Workspace; entryID: string }) =>
      recordWorkspaceAccessEvent(workspace, entryID),
    retry: 2,
  })
}
