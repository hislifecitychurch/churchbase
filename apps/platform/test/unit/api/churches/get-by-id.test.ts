import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { getChurchById } from "@/api/churches/get-by-id"
import { isChurch } from "@/api/churches/types"
import { env } from "@/lib/env"

const originalFetch = globalThis.fetch
const apiBaseURL = env.NEXT_PUBLIC_API_URL_V1.replace(/\/+$/, "")

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

const church = {
  id: "church-1",
  name: "Example Church",
  slug: "example",
  timezone: "America/Chicago",
  website: "https://example.org",
  bio: "A welcoming church.",
  city: "Springfield",
  state_or_province: "Illinois",
  country_code: "US",
  profile_complete: true,
  active_member_count: 12,
  ministry_count: 4,
}

describe("getChurchById", () => {
  it("rejects invalid profile completeness and ministry counts", () => {
    expect(isChurch({ ...church, profile_complete: "true" })).toBe(false)
    expect(isChurch({ ...church, ministry_count: -1 })).toBe(false)
  })

  it("gets and validates one church", async () => {
    mockFetch(async (input, init) => {
      expect(String(input)).toBe(`${apiBaseURL}/platform/churches/church-1`)
      expect(init?.method).toBeUndefined()
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data: church }), { status: 200 })
    })

    await expect(getChurchById("church-1")).resolves.toEqual(church)
  })

  it("encodes the church ID as a path segment", async () => {
    mockFetch(async (input) => {
      expect(String(input)).toBe(`${apiBaseURL}/platform/churches/id%2Fpart`)
      return new Response(JSON.stringify({ success: true, data: church }), { status: 200 })
    })

    await getChurchById("id/part")
  })

  it("rejects malformed church data", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ success: true, data: { id: "church-1", name: "Invalid" } }), {
          status: 200,
        }),
    )

    await expect(getChurchById("church-1")).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    })
  })

  it("preserves API not-found errors", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ success: false, errors: [{ code: "church_not_found" }] }), {
          status: 404,
        }),
    )

    const error = await getChurchById("missing").catch((cause: unknown) => cause)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, code: "church_not_found" })
  })
})
