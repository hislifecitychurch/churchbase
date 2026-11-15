import { apiRequest } from "@/api/client"

export type UpdateChurchInput = {
  name: string
  timezone: string | null
  website: string | null
  bio: string | null
  city: string | null
  state_or_province: string | null
  country_code: string | null
}

export async function updateChurch(churchID: string, input: UpdateChurchInput): Promise<void> {
  await apiRequest<unknown>(`/platform/churches/${encodeURIComponent(churchID)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })
}
