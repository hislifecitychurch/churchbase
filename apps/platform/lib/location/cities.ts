import type { ICity } from "@/lib/location-data"

export type CityOption = {
  aliases: string[]
  city: ICity
  label: string
  value: string
}

type CityGroup = {
  aliases: Set<string>
  city: ICity
}

const CITY_TYPE_PRIORITY = new Map([
  ["city", 0],
  ["municipality", 1],
  ["town", 2],
  ["village", 3],
  ["locality", 4],
  ["section", 5],
  ["adm3", 6],
  ["adm2", 7],
  ["adm1", 8],
])

function normalizeName(name: string): string {
  return name.normalize("NFKC").trim().toLowerCase()
}

// For one Wikidata entity, prefer a city-like record and then its shortest source name.
function compareCities(a: ICity, b: ICity): number {
  const aPriority = CITY_TYPE_PRIORITY.get(a.type ?? "") ?? 9
  const bPriority = CITY_TYPE_PRIORITY.get(b.type ?? "") ?? 9

  return (
    aPriority - bPriority ||
    a.name.length - b.name.length ||
    a.name.localeCompare(b.name) ||
    a.id - b.id
  )
}

function formatType(type: string | null | undefined): string {
  return (
    type?.replace(/^adm(\d+)$/i, "administrative area $1").replace(/[-_]/g, " ") || "location"
  ).replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}

export function getCityOptions(cities: ICity[]): CityOption[] {
  const groups: CityGroup[] = []
  const groupsByIdentity = new Map<string, CityGroup>()

  for (const city of cities) {
    const identity = city.wikiDataId
      ? `wiki:${city.wikiDataId}`
      : `record:${JSON.stringify([normalizeName(city.name), city.type ?? "", city.latitude, city.longitude])}`
    const existingGroup = groupsByIdentity.get(identity)
    if (existingGroup) {
      existingGroup.aliases.add(city.name)
      if (compareCities(city, existingGroup.city) < 0) existingGroup.city = city
      continue
    }

    const group = { aliases: new Set([city.name]), city }
    groups.push(group)
    groupsByIdentity.set(identity, group)
  }

  const options: CityOption[] = groups.map(({ aliases, city }) => ({
    aliases: [...aliases],
    city,
    label: city.name,
    value: String(city.id),
  }))
  const optionsByName = new Map<string, CityOption[]>()

  for (const option of options) {
    const key = normalizeName(option.city.name)
    const sameName = optionsByName.get(key) ?? []
    sameName.push(option)
    optionsByName.set(key, sameName)
  }

  for (const sameName of optionsByName.values()) {
    if (sameName.length < 2) continue

    for (const option of sameName) {
      option.label = `${option.city.name} — ${formatType(option.city.type)}`
    }
  }

  for (const option of options) {
    const alternateNames = [...new Set(option.aliases)]
      .filter((name) => normalizeName(name) !== normalizeName(option.city.name))
      .sort((a, b) => a.localeCompare(b))
    if (alternateNames.length) {
      option.label = `${option.label} (also listed as ${alternateNames.join(", ")})`
    }
  }

  const labels = new Map<string, CityOption[]>()
  for (const option of options) {
    const sameLabel = labels.get(option.label) ?? []
    sameLabel.push(option)
    labels.set(option.label, sameLabel)
  }

  for (const sameLabel of labels.values()) {
    if (sameLabel.length < 2) continue

    for (const option of sameLabel) {
      option.label = `${option.label} (${option.city.latitude}, ${option.city.longitude})`
    }
  }

  const remainingLabels = new Map<string, CityOption[]>()
  for (const option of options) {
    const sameLabel = remainingLabels.get(option.label) ?? []
    sameLabel.push(option)
    remainingLabels.set(option.label, sameLabel)
  }

  for (const sameLabel of remainingLabels.values()) {
    if (sameLabel.length < 2) continue

    for (const option of sameLabel) {
      option.label = `${option.label} #${option.city.id}`
    }
  }

  return options
}

export function findCityOptionByName(options: CityOption[], name: string): CityOption | null {
  const normalizedName = normalizeName(name)
  if (!normalizedName) return null

  const matches = options.filter((option) =>
    option.aliases.some((alias) => normalizeName(alias) === normalizedName),
  )
  return matches.length === 1 ? (matches[0] ?? null) : null
}
