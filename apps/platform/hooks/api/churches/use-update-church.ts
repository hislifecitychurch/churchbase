"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateChurch } from "@/api/churches/update"
import type { UpdateChurchInput } from "@/api/churches/update"

export function useUpdateChurch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ churchID, input }: { churchID: string; input: UpdateChurchInput }) =>
      updateChurch(churchID, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["platform", "churches"] })
    },
  })
}
