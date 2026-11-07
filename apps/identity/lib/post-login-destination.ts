import type { PlatformRole } from "@/api/users/current-user"

export function getPostLoginDestination(platformRole: PlatformRole, returnTo: string): string {
  if (platformRole === "admin" || platformRole === "staff") {
    return `/workspace?${new URLSearchParams({ returnTo }).toString()}`
  }

  return returnTo
}
