import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { getAllChurches } from "@/api/churches/get-all"
import { isChurchSummary } from "@/api/churches/types"
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
  timezone: null,
  bio: null,
  city: null,
  state_or_province: null,
  country_code: null,
  active_member_count: 0,
}

describe("getAllChurches", () => {
  it("rejects a negative active member count", () => {
    expect(isChurchSummary({ ...church, active_member_count: -1 })).toBe(false)
  })

  it("rejects missing summary fields", () => {
    expect(isChurchSummary({ id: "church-1", name: "Example Church", slug: "example" })).toBe(false)
  })

  it("gets all church summaries for the authenticated user", async () => {
    const churches = [church]
    mockFetch(async (input, init) => {
      expect(String(input)).toBe(`${apiBaseURL}/platform/churches`)
      expect(init?.method).toBeUndefined()
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data: churches }), { status: 200 })
    })

    await expect(getAllChurches()).resolves.toEqual(churches)
  })

  it("rejects malformed church summary data", async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({ success: true, data: [{ id: "church-1", name: "Invalid" }] }),
          { status: 200 },
        ),
    )

    await expect(getAllChurches()).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    })
  })

  it("preserves API authorization errors", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ success: false, errors: [{ code: "forbidden" }] }), {
          status: 403,
        }),
    )

    const error = await getAllChurches().catch((cause: unknown) => cause)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 403, code: "forbidden" })
  })
})
