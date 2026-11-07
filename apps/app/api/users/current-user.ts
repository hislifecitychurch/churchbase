import { ApiError, apiRequest } from "@/api/client"

export type CurrentUser = {
  id: string
  platform_role: string | null
  profile: {
    first_name: string | null
    last_name: string | null
  }
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const user = value as Record<string, unknown>
  const profile = user.profile

  if (typeof profile !== "object" || profile === null) {
    return false
  }

  const names = profile as Record<string, unknown>
  return (
    typeof user.id === "string" &&
    (user.platform_role === null || typeof user.platform_role === "string") &&
    (names.first_name === null || typeof names.first_name === "string") &&
    (names.last_name === null || typeof names.last_name === "string")
  )
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await apiRequest<unknown>("/users/me")

  if (!isCurrentUser(user)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid user response.")
  }

  return user
}
