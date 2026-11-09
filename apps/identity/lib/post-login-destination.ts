import type { GlobalRole } from "@/api/users/current-user"

export function getPostLoginDestination(globalRole: GlobalRole, returnTo: string): string {
  if (globalRole === "admin" || globalRole === "staff") {
    return `/workspace?${new URLSearchParams({ returnTo }).toString()}`
  }

  return returnTo
}
