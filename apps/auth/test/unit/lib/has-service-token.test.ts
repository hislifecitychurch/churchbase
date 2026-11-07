import { describe, expect, it } from "bun:test"

import { hasServiceToken } from "@lib/has-service-token"

const token = "01234567890123456789012345678901"

describe("hasServiceToken", () => {
  it("accepts only an exact bearer token", () => {
    expect(hasServiceToken(`Bearer ${token}`, token)).toBe(true)
    expect(hasServiceToken(`Bearer ${"x".repeat(token.length)}`, token)).toBe(false)
    expect(hasServiceToken("Bearer short", token)).toBe(false)
    expect(hasServiceToken(`Basic ${token}`, token)).toBe(false)
    expect(hasServiceToken(undefined, token)).toBe(false)
  })
})
