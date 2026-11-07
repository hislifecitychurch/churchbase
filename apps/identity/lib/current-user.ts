export type PlatformRole = "admin" | "staff" | null

export type CurrentUser = {
  platform_role: PlatformRole
}

export class CurrentUserRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code?: string,
  ) {
    super("Could not load the current Churchbase user")
  }
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const role = (value as Record<string, unknown>).platform_role
  return role === null || role === "admin" || role === "staff"
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL_V1

  if (!apiURL) {
    throw new CurrentUserRequestError(0, "api_url_missing")
  }

  const response = await fetch(`${apiURL.replace(/\/+$/, "")}/users/me`, {
    cache: "no-store",
    credentials: "include",
  })
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null
  const errors = body?.errors
  const firstError = Array.isArray(errors) ? errors[0] : null
  const code =
    typeof firstError === "object" &&
    firstError !== null &&
    "code" in firstError &&
    typeof firstError.code === "string"
      ? firstError.code
      : undefined

  if (!response.ok || body?.success !== true || !isCurrentUser(body.data)) {
    throw new CurrentUserRequestError(response.status, code)
  }

  return { platform_role: body.data.platform_role }
}

export function getPostLoginDestination(platformRole: PlatformRole, returnTo: string): string {
  if (platformRole === "admin" || platformRole === "staff") {
    return `/workspace?${new URLSearchParams({ returnTo }).toString()}`
  }

  return returnTo
}
