"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/api/users/current-user"

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  })
}
