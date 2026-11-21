import { ApiError, apiRequest } from "@/api/client"
import { isChurchSummary } from "@/api/churches/types"
import type { ChurchSummary } from "@/api/churches/types"

export type { ChurchSummary } from "@/api/churches/types"

export async function getAllChurches(): Promise<ChurchSummary[]> {
  const churches = await apiRequest<unknown>("/platform/churches")

  if (!Array.isArray(churches) || !churches.every(isChurchSummary)) {
    throw new ApiError(
      502,
      "invalid_api_response",
      "The API returned an invalid churches response.",
    )
  }

  return churches
}
