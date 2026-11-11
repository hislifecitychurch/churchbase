import { describe, expect, it } from "bun:test"

import { isPathActive } from "@/lib/menu/is-path-active"

describe("isPathActive", () => {
  it("matches the overview only at the root", () => {
    expect(isPathActive("/", "/")).toBe(true)
    expect(isPathActive("/churches", "/")).toBe(false)
  })

  it("matches a route and its descendants, not similarly prefixed routes", () => {
    expect(isPathActive("/churches", "/churches")).toBe(true)
    expect(isPathActive("/churches/new", "/churches")).toBe(true)
    expect(isPathActive("/churches-other", "/churches")).toBe(false)
  })
})
