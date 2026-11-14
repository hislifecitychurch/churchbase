"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createChurch } from "@/api/churches/create"

export function useCreateChurch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChurch,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["platform", "churches"] })
    },
  })
}
