import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { updateChurch } from "@/api/churches/update"
import type { UpdateChurchInput } from "@/api/churches/update"
import { env } from "@/lib/env"

const originalFetch = globalThis.fetch
const churchId = "church-1"
const apiBaseURL = env.NEXT_PUBLIC_API_URL_V1.replace(/\/+$/, "")
const input: UpdateChurchInput = {
  name: "Example Church",
  timezone: "America/Chicago",
  website: "https://example.org",
  bio: "A welcoming church.",
  city: "Springfield",
  state_or_province: "Illinois",
  country_code: "US",
}

afterEach(() => {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: originalFetch,
    writable: true,
  })
})

describe("updateChurch", () => {
  it("updates a church profile with the session cookie", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async (url: RequestInfo | URL, init?: RequestInit) => {
        expect(String(url)).toBe(`${apiBaseURL}/churches/${churchId}`)
        expect(init?.method).toBe("PUT")
        expect(init?.body).toBe(JSON.stringify(input))
        expect(init?.credentials).toBe("include")
        return new Response(JSON.stringify({ success: true, data: { id: churchId } }), {
          status: 200,
        })
      },
      writable: true,
    })

    await expect(updateChurch(churchId, input)).resolves.toBeUndefined()
  })

  it("rejects an invalid update response", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () =>
        new Response(JSON.stringify({ success: true, data: { id: "another-church" } }), {
          status: 200,
        }),
      writable: true,
    })

    await expect(updateChurch(churchId, input)).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    })
  })
})
