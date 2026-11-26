import { describe, expect, it } from "bun:test"

import {
  getDefaultTimezoneForCountry,
  getTimezoneAfterCountryChange,
} from "@/lib/churches/get-default-timezone-for-country"

describe("getDefaultTimezoneForCountry", () => {
  it("returns the timezone when the country has exactly one", () => {
    expect(getDefaultTimezoneForCountry(["Asia/Manila"])).toBe("Asia/Manila")
  })

  it("does not guess when the country has multiple or no timezones", () => {
    expect(getDefaultTimezoneForCountry(["America/Chicago", "America/New_York"])).toBe("")
    expect(getDefaultTimezoneForCountry([])).toBe("")
  })

  it("keeps valid timezones and preserves the current value when no country timezones are available", () => {
    expect(getTimezoneAfterCountryChange(["Asia/Manila"], "")).toBe("Asia/Manila")
    expect(
      getTimezoneAfterCountryChange(["America/Chicago", "America/New_York"], "America/Chicago"),
    ).toBe("America/Chicago")
    expect(
      getTimezoneAfterCountryChange(["America/Chicago", "America/New_York"], "Europe/London"),
    ).toBe("")
    expect(getTimezoneAfterCountryChange([], "Europe/London")).toBe("Europe/London")
  })
})
