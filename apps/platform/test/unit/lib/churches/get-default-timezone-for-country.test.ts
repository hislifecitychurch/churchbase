import { describe, expect, it } from "bun:test"

import {
  getDefaultTimezoneForCountry,
  getTimezoneAfterCountryChange,
} from "@/lib/churches/get-default-timezone-for-country"

describe("getDefaultTimezoneForCountry", () => {
  it("returns the timezone when the country has exactly one", () => {
    expect(getDefaultTimezoneForCountry("PH")).toBe("Asia/Manila")
  })

  it("does not guess for countries with multiple timezones or unknown codes", () => {
    expect(getDefaultTimezoneForCountry("US")).toBe("")
    expect(getDefaultTimezoneForCountry("XX")).toBe("")
  })

  it("keeps a valid timezone, auto-selects an unambiguous one, and preserves it when country is cleared", () => {
    expect(getTimezoneAfterCountryChange("PH", "")).toBe("Asia/Manila")
    expect(getTimezoneAfterCountryChange("US", "America/Chicago")).toBe("America/Chicago")
    expect(getTimezoneAfterCountryChange("US", "Europe/London")).toBe("")
    expect(getTimezoneAfterCountryChange("", "Europe/London")).toBe("Europe/London")
  })
})
