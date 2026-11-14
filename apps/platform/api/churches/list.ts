import { ApiError, apiRequest } from "@/api/client"

export type Church = {
  id: string
  name: string
  slug: string
}

function isChurch(value: unknown): value is Church {
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
    church.slug.length > 0
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
