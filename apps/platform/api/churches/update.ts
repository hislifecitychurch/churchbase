import { apiRequest } from "@/api/client"

export type UpdateChurchInput = {
  name: string
  timezone?: string
  website?: string
  bio?: string
}

export async function updateChurch(churchID: string, input: UpdateChurchInput): Promise<void> {
  await apiRequest<unknown>(`/platform/churches/${encodeURIComponent(churchID)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })
}
