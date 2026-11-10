import { ApiError, apiRequest } from "@/api/client"

export type GlobalRole = "admin" | "staff" | null

export type CurrentUser = {
  global_roles: GlobalRole
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const role = (value as Record<string, unknown>).global_roles
  return role === null || role === "admin" || role === "staff"
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await apiRequest<unknown>("/users/me")

  if (!isCurrentUser(user)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid user response.")
  }

  return { global_roles: user.global_roles }
}
