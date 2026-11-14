import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { getChurches } from "@/api/churches/list"

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

describe("getChurches", () => {
  it("loads the authenticated church list", async () => {
    const churches = [
      {
        id: "church-1",
        name: "Example Church",
        slug: "example",
        timezone: null,
        website: null,
        bio: null,
      },
    ]
    mockFetch(async (input, init) => {
      expect(String(input)).toBe(`${apiBaseURL}/platform/churches`)
      expect(init?.method).toBeUndefined()
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data: churches }), { status: 200 })
    })

    await expect(getChurches()).resolves.toEqual(churches)
  })

  it("rejects malformed church data", async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({ success: true, data: [{ id: "church-1", name: "Invalid" }] }),
          {
            status: 200,
          },
        ),
    )

    await expect(getChurches()).rejects.toMatchObject({
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

    const error = await getChurches().catch((cause: unknown) => cause)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 403, code: "forbidden" })
  })
})
