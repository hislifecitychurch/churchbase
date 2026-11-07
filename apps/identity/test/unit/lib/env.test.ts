import { describe, expect, it } from "bun:test"

import { envSchema } from "@/lib/env"

describe("envSchema", () => {
  it("parses comma-separated return origins", () => {
    const env = envSchema.parse({
      NEXT_PUBLIC_IDENTITY_ALLOWED_RETURN_ORIGINS: "https://app.example, https://admin.example",
    })

    expect(env.NEXT_PUBLIC_IDENTITY_ALLOWED_RETURN_ORIGINS).toEqual([
      "https://app.example",
      "https://admin.example",
    ])
  })

  it("rejects invalid endpoint URLs", () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_AUTH_URL: "not a URL" })).toThrow()
  })
})
