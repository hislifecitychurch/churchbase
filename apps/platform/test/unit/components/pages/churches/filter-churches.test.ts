import { describe, expect, it } from "bun:test"

import type { ChurchSummary } from "@/api/churches/types"
import { filterChurchesByName } from "@/components/pages/churches/_data-table/filters"

const churches: ChurchSummary[] = [
  {
    id: "1",
    name: "Hope Community Church",
    slug: "hope-community",
    timezone: null,
    bio: null,
    city: null,
    state_or_province: null,
    country_code: null,
    active_member_count: 0,
  },
  {
    id: "2",
    name: "Grace Church",
    slug: "grace",
    timezone: null,
    bio: null,
    city: null,
    state_or_province: null,
    country_code: null,
    active_member_count: 0,
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
