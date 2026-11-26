import { ApiError, apiRequest } from "@/api/client"

export type UpdateChurchInput = {
  name: string
  timezone: string | null
  website: string | null
  bio: string | null
  city: string | null
  state_or_province: string | null
  country_code: string | null
}

export async function updateChurch(churchId: string, input: UpdateChurchInput): Promise<void> {
  const result = await apiRequest<unknown>(`/churches/${encodeURIComponent(churchId)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })

  if (
    typeof result !== "object" ||
    result === null ||
    !("id" in result) ||
    result.id !== churchId
  ) {
    throw new ApiError(
      502,
      "invalid_api_response",
      "The API returned an invalid church update response.",
    )
  }
}
