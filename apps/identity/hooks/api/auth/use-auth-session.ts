"use client"

import { authClient } from "@/api/auth/client"

export function useAuthSession() {
  return authClient.useSession()
}
