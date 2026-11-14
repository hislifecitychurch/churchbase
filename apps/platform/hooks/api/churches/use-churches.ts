"use client"

import { useQuery } from "@tanstack/react-query"

import { getChurches } from "@/api/churches/list"

export function useChurches() {
  return useQuery({
    queryKey: ["platform", "churches"],
    queryFn: getChurches,
    retry: false,
  })
}
