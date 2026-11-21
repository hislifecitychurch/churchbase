import { ApiError, apiRequest } from "@/api/client"
import { isChurch } from "@/api/churches/types"
import type { Church } from "@/api/churches/types"

export async function getChurchById(churchId: string): Promise<Church> {
  const church = await apiRequest<unknown>(`/platform/churches/${encodeURIComponent(churchId)}`)

  if (!isChurch(church)) {
    throw new ApiError(502, "invalid_api_response", "The API returned an invalid church response.")
  }

  return church
}
