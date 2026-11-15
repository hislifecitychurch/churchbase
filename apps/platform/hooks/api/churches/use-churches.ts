"use client"

import { useQuery } from "@tanstack/react-query"

import { getAllChurches } from "@/api/churches/get-all"

export function useChurches() {
  return useQuery({
    queryKey: ["platform", "churches"],
    queryFn: getAllChurches,
    retry: false,
  })
}
