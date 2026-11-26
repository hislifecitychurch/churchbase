import { describe, expect, it } from "bun:test"

import { isPathActive } from "@/lib/menu/is-path-active"

describe("isPathActive", () => {
  it("matches nested routes unless exact matching is requested", () => {
    expect(isPathActive("/ministries/music/rehearsals", "/ministries/music")).toBe(true)
    expect(isPathActive("/ministries/music/rehearsals", "/ministries/music", true)).toBe(false)
    expect(isPathActive("/ministries/music", "/ministries/music", true)).toBe(true)
  })

  it("matches the church-wide overview only at the root", () => {
    expect(isPathActive("/", "/")).toBe(true)
    expect(isPathActive("/people", "/")).toBe(false)
  })
})
