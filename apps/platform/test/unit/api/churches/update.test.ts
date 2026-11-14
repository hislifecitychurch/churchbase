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
  it("updates a church with the authenticated session", async () => {
    const churchID = "church-1"
    const input = {
      name: "Example Church",
      timezone: "America/Chicago",
      website: "https://example.org",
      bio: "A welcoming church.",
    }
    mockFetch(async (url, init) => {
      expect(String(url)).toBe(`${apiBaseURL}/platform/churches/${churchID}`)
      expect(init?.method).toBe("PUT")
      expect(init?.body).toBe(JSON.stringify(input))
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data: { id: churchID } }), {
        status: 200,
      })
    })

    await expect(updateChurch(churchID, input)).resolves.toBeUndefined()
  })

  it("preserves API not-found errors", async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({
            success: false,
            errors: [{ code: "church_not_found", message: "Church not found" }],
          }),
          { status: 404 },
        ),
    )

    const error = await updateChurch("missing", { name: "Example Church" }).catch(
      (cause: unknown) => cause,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, code: "church_not_found" })
  })
})
