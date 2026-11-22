import { ApiError, apiRequest } from "@/api/client"
import { isChurchSummary } from "@/api/churches/_types"
import type { ChurchSummary } from "@/api/churches/_types"

export type { ChurchSummary } from "@/api/churches/_types"

export async function getAllChurches(): Promise<ChurchSummary[]> {
  const churches = await apiRequest<unknown>("/churches")

  if (!Array.isArray(churches) || !churches.every(isChurchSummary)) {
    throw new ApiError(
      502,
      "invalid_api_response",
      "The API returned an invalid churches response.",
    )
  }

  return churches
}
