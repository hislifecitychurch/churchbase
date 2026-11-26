const REQUEST_TIMEOUT_MS = 10_000

type ApiEnvelope<T> = {
  data?: T
  errors?: { code?: unknown; message?: unknown }[]
  message?: unknown
  success?: unknown
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code?: string,
    message = "The API request could not be completed.",
  ) {
    super(message)
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL_V1?.replace(/\/+$/, "")
  if (!apiBaseURL) {
    throw new ApiError(0, "api_url_missing", "The API URL is not configured.")
  }

  const headers = new Headers(init.headers)
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json")
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseURL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      cache: init.cache ?? "no-store",
      credentials: "include",
      headers,
      signal: init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch {
    throw new ApiError(0, "api_unavailable", "The API is unavailable. Try again shortly.")
  }

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  const firstError = body?.errors?.[0]
  const code = typeof firstError?.code === "string" ? firstError.code : undefined
  const message =
    typeof firstError?.message === "string"
      ? firstError.message
      : typeof body?.message === "string"
        ? body.message
        : undefined

  if (!response.ok || body?.success !== true) {
    throw new ApiError(response.status, code, message)
  }

  return body.data as T
}
