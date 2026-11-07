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
  it("loads the platform role from the API with session credentials", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async (input: RequestInfo | URL, init?: RequestInit) => {
        expect(String(input)).toBe(`${apiBaseURL}/users/me`)
        expect(init?.credentials).toBe("include")
        return new Response(JSON.stringify({ success: true, data: { platform_role: "staff" } }), {
          status: 200,
        })
      },
      writable: true,
    })

    await expect(getCurrentUser()).resolves.toEqual({ platform_role: "staff" })
  })

  it("preserves API error codes for callers", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () =>
        new Response(
          JSON.stringify({
            success: false,
            errors: [{ code: "user_not_provisioned", message: "Not provisioned" }],
          }),
          { status: 403 },
        ),
      writable: true,
    })

    const error = await getCurrentUser().catch((cause: unknown) => cause)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 403, code: "user_not_provisioned" })
  })
})
