import { ApiError, apiRequest } from "@/api/client"

export type Church = {
  id: string
  name: string
  slug: string
  timezone: string | null
  website: string | null
  bio: string | null
  active_member_count: number
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
    [church.timezone, church.website, church.bio].every(
      (field) => field === null || typeof field === "string",
    ) &&
    Number.isSafeInteger(church.active_member_count) &&
    (church.active_member_count as number) >= 0
  )
}

export async function getChurches(): Promise<Church[]> {
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
