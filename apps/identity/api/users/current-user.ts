import { ApiError, apiRequest } from "@/api/client"

export type PlatformRole = "admin" | "staff" | null

export type LastWorkspaceAccess = {
  workspace: "app" | "platform"
  occurred_at: string
}

export type CurrentUser = {
  platform_role: PlatformRole
  last_workspace_access: LastWorkspaceAccess | null
}

function isLastWorkspaceAccess(value: unknown): value is LastWorkspaceAccess | null {
  if (value === null) {
    return true
  }
  if (typeof value !== "object") {
    return false
  }

  const access = value as Record<string, unknown>
  return (
    (access.workspace === "app" || access.workspace === "platform") &&
    typeof access.occurred_at === "string" &&
    !Number.isNaN(Date.parse(access.occurred_at))
  )
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const user = value as Record<string, unknown>
  const role = user.platform_role
  const validRole = role === null || role === "admin" || role === "staff"
  return validRole && isLastWorkspaceAccess(user.last_workspace_access)
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await apiRequest<unknown>("/users/me")

  if (!isCurrentUser(user)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid user response.")
  }

  return {
    platform_role: user.platform_role,
    last_workspace_access: user.last_workspace_access,
  }
}
