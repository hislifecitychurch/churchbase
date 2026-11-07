import type { Workspace } from "@/api/workspace-access-events"

export function getWorkspaceEntryID(userID: string, workspace: Workspace): string {
  try {
    const key = `churchbase:workspace-entry:${userID}:${workspace}`
    const navigation = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined
    const existing = sessionStorage.getItem(key)
    if (navigation?.type === "reload" && existing) {
      return existing
    }

    const entryID = crypto.randomUUID()
    sessionStorage.setItem(key, entryID)
    return entryID
  } catch {
    // shortcut: browsers without navigation timing or session storage may double-count refreshes; use server-issued IDs if material.
    return crypto.randomUUID()
  }
}
