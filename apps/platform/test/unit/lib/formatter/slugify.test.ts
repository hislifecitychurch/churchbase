import { describe, expect, it } from "bun:test"

import { slugifyChurchName } from "@/lib/formatter/slugify"

describe("slugifyChurchName", () => {
  it("lowercases names and turns spaces and punctuation into single dashes", () => {
    expect(slugifyChurchName("  Saint John's, North End!  ")).toBe("saint-john-s-north-end")
  })

  it("preserves Unicode letters and numbers", () => {
    expect(slugifyChurchName("Église de Noël 2026")).toBe("église-de-noël-2026")
  })

  it("returns an empty slug when the name has no letters or numbers", () => {
    expect(slugifyChurchName("!!! --- ...")).toBe("")
  })
})
