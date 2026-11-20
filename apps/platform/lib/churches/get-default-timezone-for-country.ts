import { getCountry } from "countries-and-timezones"

export function getDefaultTimezoneForCountry(countryCode: string): string {
  const timezones = getCountry(countryCode)?.timezones ?? []
  return timezones.length === 1 ? (timezones[0] ?? "") : ""
}

export function getTimezoneAfterCountryChange(
  countryCode: string,
  currentTimezone: string,
): string {
  if (!countryCode) return currentTimezone

  const timezones = getCountry(countryCode)?.timezones ?? []
  return timezones.some((timezone) => timezone === currentTimezone)
    ? currentTimezone
    : getDefaultTimezoneForCountry(countryCode)
}
