import { afterEach, describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { getAccessContexts } from "@/api/access-contexts"

const originalFetch = globalThis.fetch
const originalAPIURL = process.env.NEXT_PUBLIC_API_URL_V1

function setResponse(data: unknown, status = 200): void {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe("http://localhost:36080/api/v1/users/me/access-contexts")
      expect(init?.credentials).toBe("include")
      return new Response(JSON.stringify({ success: true, data }), { status })
    },
    writable: true,
  })
}

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

describe("getAccessContexts", () => {
  it("loads validated server contexts and ignores capabilities the UI does not know", async () => {
    process.env.NEXT_PUBLIC_API_URL_V1 = "http://localhost:36080/api/v1"
    setResponse({
      contexts: [
        {
          id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
          church_id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
          kind: "church",
          slug: "churchbase",
          name: "Church-wide",
          church_name: "Sample Church",
          role: "staff",
          capabilities: ["church.overview.read", "future.capability"],
        },
      ],
    })

    await expect(getAccessContexts()).resolves.toEqual([
      {
        id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
        church_id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
        kind: "church",
        slug: "churchbase",
        name: "Church-wide",
        church_name: "Sample Church",
        role: "staff",
        capabilities: ["church.overview.read"],
      },
    ])
  })

  it("rejects malformed or unsafe contexts", async () => {
    process.env.NEXT_PUBLIC_API_URL_V1 = "http://localhost:36080/api/v1"
    setResponse({
      contexts: [
        {
          id: "not-a-uuid",
          church_id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
          kind: "ministry",
          slug: "../../care",
          name: "Unsafe",
          church_name: "Sample Church",
          role: "lead",
          capabilities: ["care.read"],
        },
      ],
    })

    await expect(getAccessContexts()).rejects.toMatchObject({
      status: 502,
      code: "invalid_api_response",
    } satisfies Partial<ApiError>)
  })

  it("preserves API authorization errors", async () => {
    process.env.NEXT_PUBLIC_API_URL_V1 = "http://localhost:36080/api/v1"
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

    await expect(getAccessContexts()).rejects.toMatchObject({
      status: 403,
      code: "user_not_provisioned",
    } satisfies Partial<ApiError>)
  })
})
