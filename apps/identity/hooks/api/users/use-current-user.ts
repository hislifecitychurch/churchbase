"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/api/users/current-user"

export function useCurrentUser({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  })
}
