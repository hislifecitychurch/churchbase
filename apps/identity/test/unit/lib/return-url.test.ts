import { describe, expect, it } from "bun:test"

import { getSafeReturnURL } from "@/lib/return-url"

const config = {
  allowedOrigins: [
    "http://localhost:36001",
    "http://localhost:36002",
    "https://app.usechurchbase.com",
  ],
  defaultReturnURL: "http://localhost:36002/",
}

describe("getSafeReturnURL", () => {
  it("uses the default URL when no return target is supplied", () => {
    expect(getSafeReturnURL(undefined, config)).toBe(config.defaultReturnURL)
  })

  it("accepts a Platform return URL", () => {
    expect(getSafeReturnURL("http://localhost:36001/", config)).toBe("http://localhost:36001/")
  })

  it("preserves a path on an allowed origin", () => {
    expect(getSafeReturnURL("https://app.usechurchbase.com/people?view=active", config)).toBe(
      "https://app.usechurchbase.com/people?view=active",
    )
  })

  it.each([
    "https://attacker.example/",
    "//attacker.example/",
    "javascript:alert(1)",
    "https://user@app.usechurchbase.com/",
    "not a URL",
  ])("falls back for an unsafe target: %s", (candidate) => {
    expect(getSafeReturnURL(candidate, config)).toBe(config.defaultReturnURL)
  })

  it("rejects a default target outside the origin allowlist", () => {
    expect(() =>
      getSafeReturnURL(undefined, { ...config, defaultReturnURL: "https://attacker.example/" }),
    ).toThrow("Default return URL must use an allowed origin")
  })
})
