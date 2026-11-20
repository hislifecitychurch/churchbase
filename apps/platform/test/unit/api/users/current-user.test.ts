import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { getCurrentUser } from "@/api/users/current-user"
import { env } from "@/lib/env"

const originalFetch = globalThis.fetch
const apiBaseURL = env.NEXT_PUBLIC_API_URL_V1.replace(/\/+$/, "")

afterEach(() => {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: originalFetch,
    writable: true,
  })
})

describe("getCurrentUser", () => {
  it("loads a global role with the session cookie", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async (input: RequestInfo | URL, init?: RequestInit) => {
        expect(String(input)).toBe(`${apiBaseURL}/users/me`)
        expect(init?.credentials).toBe("include")
        return new Response(JSON.stringify({ success: true, data: { global_roles: "admin" } }), {
          status: 200,
        })
      },
      writable: true,
    })

    await expect(getCurrentUser()).resolves.toEqual({ global_roles: "admin" })
  })

  it("accepts an authenticated user without a global role", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () =>
        new Response(JSON.stringify({ success: true, data: { global_roles: null } }), {
          status: 200,
        }),
      writable: true,
    })

    await expect(getCurrentUser()).resolves.toEqual({ global_roles: null })
  })

  it("rejects invalid role data", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () =>
        new Response(JSON.stringify({ success: true, data: { global_roles: "owner" } }), {
          status: 200,
        }),
      writable: true,
    })

    await expect(getCurrentUser()).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    })
  })

  it("preserves API authentication errors", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () =>
        new Response(JSON.stringify({ success: false, errors: [{ code: "session_invalid" }] }), {
          status: 401,
        }),
      writable: true,
    })

    const error = await getCurrentUser().catch((cause: unknown) => cause)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 401, code: "session_invalid" })
  })
})
