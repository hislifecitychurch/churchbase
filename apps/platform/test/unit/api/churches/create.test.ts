import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { createChurch } from "@/api/churches/create"

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

describe("createChurch", () => {
  it("creates a church and returns the validated response", async () => {
    const input = {
      name: "Example Church",
      slug: "example-church",
      timezone: "America/Chicago",
      website: "https://example.org",
      bio: "A welcoming church.",
      city: "Springfield",
      state_or_province: "Illinois",
      country_code: "US",
    }
    const church = { id: "church-1", ...input, active_member_count: 0 }
    mockFetch(async (url, init) => {
      expect(String(url)).toBe(`${apiBaseURL}/platform/churches`)
      expect(init?.method).toBe("POST")
      expect(init?.body).toBe(JSON.stringify(input))
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data: church }), { status: 201 })
    })

    await expect(createChurch(input)).resolves.toEqual(church)
  })

  it("rejects malformed church data", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ success: true, data: { id: "church-1", name: "Invalid" } }), {
          status: 201,
        }),
    )

    await expect(createChurch({ name: "Invalid", slug: "invalid" })).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    })
  })

  it("preserves API slug-conflict errors", async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({
            success: false,
            errors: [{ code: "church_slug_conflict", message: "Slug already exists" }],
          }),
          { status: 409 },
        ),
    )

    const error = await createChurch({ name: "Example Church", slug: "example-church" }).catch(
      (cause: unknown) => cause,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 409, code: "church_slug_conflict" })
  })
})
