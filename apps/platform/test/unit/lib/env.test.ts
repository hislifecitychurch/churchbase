import { describe, expect, it } from "bun:test"

import { envSchema } from "@/lib/env"

describe("envSchema", () => {
  it("defaults the API URL", () => {
    expect(envSchema.parse({}).NEXT_PUBLIC_API_URL_V1).toBe("http://localhost:36080/api/v1")
  })

  it("rejects invalid endpoint URLs", () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_IDENTITY_URL: "not a URL" })).toThrow()
  })
})
