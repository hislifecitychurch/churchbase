"use client"

import { useQuery } from "@tanstack/react-query"

import { getAccessContexts } from "@/api/access-contexts"

export function useAccessContexts() {
  return useQuery({
    queryKey: ["access-contexts"],
    queryFn: getAccessContexts,
    retry: false,
  })
}
