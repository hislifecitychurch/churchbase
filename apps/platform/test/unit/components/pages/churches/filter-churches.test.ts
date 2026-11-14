import { describe, expect, it } from "bun:test"

import type { Church } from "@/api/churches/list"
import { filterChurchesByName } from "@/components/pages/churches/_data-table/filters"

const churches: Church[] = [
  {
    id: "1",
    name: "Hope Community Church",
    slug: "hope-community",
    timezone: null,
    website: null,
    bio: null,
  },
  {
    id: "2",
    name: "Grace Church",
    slug: "grace",
    timezone: null,
    website: null,
    bio: null,
  },
]

describe("filterChurchesByName", () => {
  it("returns every church when the search is blank", () => {
    expect(filterChurchesByName(churches, "  ")).toEqual(churches)
  })

  it("matches church names case-insensitively and ignores surrounding whitespace", () => {
    expect(filterChurchesByName(churches, "  COMMUNITY ").map((church) => church.id)).toEqual(["1"])
  })
})
