"use client"

import { useMutation } from "@tanstack/react-query"

import { signOut } from "@/api/auth/client"

export function useSignOut() {
  return useMutation({ mutationFn: signOut })
}
