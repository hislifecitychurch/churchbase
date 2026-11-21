import { describe, expect, it } from "bun:test"

import { findCityOptionByName, getCityOptions } from "@/lib/location/cities"
import type { ICity } from "@/lib/location-data"

function city(overrides: Partial<ICity> & Pick<ICity, "id" | "name">): ICity {
  const { id, name, ...properties } = overrides
  return {
    id,
    name,
    state_id: 1,
    state_code: "PAM",
    country_id: 174,
    country_code: "PH",
    latitude: "15.00000000",
    longitude: "120.00000000",
    native: null,
    timezone: "Asia/Manila",
    translations: {},
    ...properties,
  }
}

describe("getCityOptions", () => {
  it("merges Wikidata aliases and picks the shorter canonical city name", () => {
    const options = getCityOptions([
      city({ id: 81268, name: "Angeles City", type: "city", wikiDataId: "Q55741" }),
      city({ id: 145351, name: "Angeles", type: "city", wikiDataId: "Q55741" }),
    ])

    expect(options).toHaveLength(1)
    expect(options[0]).toMatchObject({
      label: "Angeles (also listed as Angeles City)",
      value: "145351",
      aliases: ["Angeles City", "Angeles"],
    })
    expect(findCityOptionByName(options, " Angeles City ")).toBe(options[0] ?? null)
  })

  it("qualifies same-name records with different Wikidata IDs", () => {
    const options = getCityOptions([
      city({ id: 1, name: "Springfield", type: "city", wikiDataId: "Q1" }),
      city({ id: 2, name: "Springfield", type: "municipality", wikiDataId: "Q2" }),
    ])

    expect(options.map(({ label }) => label)).toEqual([
      "Springfield — City",
      "Springfield — Municipality",
    ])
    expect(findCityOptionByName(options, "Springfield")).toBeNull()
  })

  it("merges identical records without Wikidata IDs and distinguishes matching types by coordinates", () => {
    const options = getCityOptions([
      city({ id: 1, name: "Picong", type: "city", latitude: "7.00000000", wikiDataId: null }),
      city({ id: 2, name: "Picong", type: "city", latitude: "7.00000000", wikiDataId: null }),
      city({ id: 3, name: "Picong", type: "city", latitude: "8.00000000", wikiDataId: null }),
    ])

    expect(options).toHaveLength(2)
    expect(options.map(({ label }) => label)).toEqual([
      "Picong — City (7.00000000, 120.00000000)",
      "Picong — City (8.00000000, 120.00000000)",
    ])
  })
})
