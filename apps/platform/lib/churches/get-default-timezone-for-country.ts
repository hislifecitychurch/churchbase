export function getDefaultTimezoneForCountry(timezones: string[]): string {
  return timezones.length === 1 ? (timezones[0] ?? "") : ""
}

export function getTimezoneAfterCountryChange(
  timezones: string[],
  currentTimezone: string,
): string {
  if (timezones.length === 0) return currentTimezone
  return timezones.some((timezone) => timezone === currentTimezone)
    ? currentTimezone
    : getDefaultTimezoneForCountry(timezones)
}
