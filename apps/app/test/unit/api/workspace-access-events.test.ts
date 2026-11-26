import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { recordWorkspaceAccessEvent } from "@/api/workspace-access-events"

const originalFetch = globalThis.fetch
const originalAPIURL = process.env.NEXT_PUBLIC_API_URL_V1

afterEach(() => {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: originalFetch,
    writable: true,
  })
  if (originalAPIURL === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL_V1
  } else {
    process.env.NEXT_PUBLIC_API_URL_V1 = originalAPIURL
  }
})

describe("recordWorkspaceAccessEvent", () => {
  it("posts a validated entry ID with the session cookie", async () => {
    process.env.NEXT_PUBLIC_API_URL_V1 = "http://localhost:36080/api/v1"
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async (input: RequestInfo | URL, init?: RequestInit) => {
        expect(String(input)).toBe("http://localhost:36080/api/v1/users/me/workspace-access-events")
        expect(init?.method).toBe("POST")
        expect(init?.credentials).toBe("include")
        expect(JSON.parse(String(init?.body))).toEqual({
          entry_id: "entry-1",
          workspace: "app",
        })
        return new Response(
          JSON.stringify({
            success: true,
            data: { id: "event-1", workspace: "app", occurred_at: "2026-01-02T03:04:05Z" },
          }),
          { status: 201 },
        )
      },
      writable: true,
    })

    await expect(recordWorkspaceAccessEvent("app", "entry-1")).resolves.toEqual({
      id: "event-1",
      workspace: "app",
      occurred_at: "2026-01-02T03:04:05Z",
    })
  })

  it("rejects invalid API event responses", async () => {
    process.env.NEXT_PUBLIC_API_URL_V1 = "http://localhost:36080/api/v1"
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () =>
        new Response(JSON.stringify({ success: true, data: { workspace: "unknown" } }), {
          status: 201,
        }),
      writable: true,
    })

    await expect(recordWorkspaceAccessEvent("app", "entry-1")).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    } satisfies Partial<ApiError>)
  })
})
