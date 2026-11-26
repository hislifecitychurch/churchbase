import { ApiError, apiRequest } from "@/api/client"

export type GlobalRole = "admin" | "staff" | null

export type UserProfile = {
  first_name?: string | null
  last_name?: string | null
}

export type CurrentUser = {
  global_roles: GlobalRole
  profile?: UserProfile | null
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string"
}

function isUserProfile(value: unknown): value is UserProfile | null | undefined {
  if (value === undefined || value === null) {
    return true
  }
  if (typeof value !== "object") {
    return false
  }
  const record = value as Record<string, unknown>
  return isOptionalString(record.first_name) && isOptionalString(record.last_name)
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  const role = record.global_roles
  return (role === null || role === "admin" || role === "staff") && isUserProfile(record.profile)
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await apiRequest<unknown>("/users/me")

  if (!isCurrentUser(user)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid user response.")
  }

  return {
    global_roles: user.global_roles,
    ...(user.profile !== undefined ? { profile: user.profile } : {}),
  }
}
