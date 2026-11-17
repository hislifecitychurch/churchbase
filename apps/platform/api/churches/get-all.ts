import { ApiError, apiRequest } from "@/api/client"

export type Church = {
  id: string
  name: string
  slug: string
  timezone: string | null
  website: string | null
  bio: string | null
  city: string | null
  state_or_province: string | null
  country_code: string | null
  profile_complete: boolean
  active_member_count: number
  ministry_count: number
}

export function isChurch(value: unknown): value is Church {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const church = value as Record<string, unknown>
  return (
    typeof church.id === "string" &&
    church.id.length > 0 &&
    typeof church.name === "string" &&
    church.name.length > 0 &&
    typeof church.slug === "string" &&
    church.slug.length > 0 &&
    [
      church.timezone,
      church.website,
      church.bio,
      church.city,
      church.state_or_province,
      church.country_code,
    ].every((field) => field === null || typeof field === "string") &&
    typeof church.profile_complete === "boolean" &&
    Number.isSafeInteger(church.active_member_count) &&
    (church.active_member_count as number) >= 0 &&
    Number.isSafeInteger(church.ministry_count) &&
    (church.ministry_count as number) >= 0
  )
}

export async function getAllChurches(): Promise<Church[]> {
  const churches = await apiRequest<unknown>("/platform/churches")

  if (!Array.isArray(churches) || !churches.every(isChurch)) {
    throw new ApiError(
      502,
      "invalid_api_response",
      "The API returned an invalid churches response.",
    )
  }

  return churches
}
