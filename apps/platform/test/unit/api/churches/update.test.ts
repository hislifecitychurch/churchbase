import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { updateChurch } from "@/api/churches/update"

const originalFetch = globalThis.fetch
const apiBaseURL = (process.env.NEXT_PUBLIC_API_URL_V1 ?? "http://localhost:36080/api/v1").replace(
  /\/+$/,
  "",
)

type FetchFunction = (
  ...args: Parameters<typeof globalThis.fetch>
) => ReturnType<typeof globalThis.fetch>

function mockFetch(fetch: FetchFunction) {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: fetch,
    writable: true,
  })
}

afterEach(() => {
  mockFetch(originalFetch)
})

describe("updateChurch", () => {
  it("updates location with the authenticated session", async () => {
    const churchId = "church-1"
    const input = {
      name: "Example Church",
      timezone: "America/Chicago",
      website: "https://example.org",
      bio: "A welcoming church.",
      city: "Springfield",
      state_or_province: "Illinois",
      country_code: "US",
    }
    mockFetch(async (url, init) => {
      expect(String(url)).toBe(`${apiBaseURL}/platform/churches/${churchId}`)
      expect(init?.method).toBe("PUT")
      expect(init?.body).toBe(JSON.stringify(input))
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data: { id: churchId } }), {
        status: 200,
      })
    })

    await expect(updateChurch(churchId, input)).resolves.toBeUndefined()
  })

  it("preserves API errors", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ success: false, errors: [{ code: "church_not_found" }] }), {
          status: 404,
        }),
    )

    const error = await updateChurch("missing", {
      name: "Example Church",
      timezone: null,
      website: null,
      bio: null,
      city: null,
      state_or_province: null,
      country_code: null,
    }).catch((cause: unknown) => cause)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, code: "church_not_found" })
  })
})
