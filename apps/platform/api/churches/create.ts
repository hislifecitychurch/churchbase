import { ApiError, apiRequest } from "@/api/client"
import { isChurch } from "@/api/churches/list"
import type { Church } from "@/api/churches/list"

export type CreateChurchInput = {
  name: string
  slug: string
}

export async function createChurch(input: CreateChurchInput): Promise<Church> {
  const church = await apiRequest<unknown>("/platform/churches", {
    method: "POST",
    body: JSON.stringify(input),
  })

  if (!isChurch(church)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid church response.")
  }

  return church
}
