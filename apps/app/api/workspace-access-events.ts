import { ApiError, apiRequest } from "@/api/client"

export type Workspace = "app" | "platform"

type WorkspaceAccessEvent = {
  id: string
  workspace: Workspace
  occurred_at: string
}

function isWorkspaceAccessEvent(value: unknown): value is WorkspaceAccessEvent {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const event = value as Record<string, unknown>
  return (
    typeof event.id === "string" &&
    (event.workspace === "app" || event.workspace === "platform") &&
    typeof event.occurred_at === "string" &&
    !Number.isNaN(Date.parse(event.occurred_at))
  )
}

export async function recordWorkspaceAccessEvent(
  workspace: Workspace,
  entryID: string,
): Promise<WorkspaceAccessEvent> {
  const event = await apiRequest<unknown>("/users/me/workspace-access-events", {
    method: "POST",
    body: JSON.stringify({ entry_id: entryID, workspace }),
  })
  if (!isWorkspaceAccessEvent(event)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid workspace event.")
  }
  return event
}
