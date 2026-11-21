"use client"

import { useQuery } from "@tanstack/react-query"

import { getChurchById } from "@/api/churches/get-by-id"

export function useChurch(churchId: string) {
  return useQuery({
    queryKey: ["platform", "churches", churchId],
    queryFn: () => getChurchById(churchId),
    enabled: Boolean(churchId),
    retry: false,
  })
}
