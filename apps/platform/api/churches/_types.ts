export type Church = {
  id: string
  name: string
  slug: string
  timezone: string | null
  website: string | null
  bio: string | null
  city: string | null
  state_or_province: string | null
  country_code: string | null
  profile_complete: boolean
  active_member_count: number
  ministry_count: number
}

export type ChurchSummary = Pick<
  Church,
  | "id"
  | "name"
  | "slug"
  | "timezone"
  | "bio"
  | "city"
  | "state_or_province"
  | "country_code"
  | "active_member_count"
>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function hasChurchIdentity(church: Record<string, unknown>): boolean {
  return (
    typeof church.id === "string" &&
    church.id.length > 0 &&
    typeof church.name === "string" &&
    church.name.length > 0 &&
    typeof church.slug === "string" &&
    church.slug.length > 0
  )
}

function hasNullableStringFields(
  church: Record<string, unknown>,
  fields: (keyof Church)[],
): boolean {
  return fields.every((field) => church[field] === null || typeof church[field] === "string")
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0
}

export function isChurch(value: unknown): value is Church {
  if (!isRecord(value)) return false

  return (
    hasChurchIdentity(value) &&
    hasNullableStringFields(value, [
      "timezone",
      "website",
      "bio",
      "city",
      "state_or_province",
      "country_code",
    ]) &&
    typeof value.profile_complete === "boolean" &&
    isNonNegativeSafeInteger(value.active_member_count) &&
    isNonNegativeSafeInteger(value.ministry_count)
  )
}

export function isChurchSummary(value: unknown): value is ChurchSummary {
  if (!isRecord(value)) return false

  return (
    hasChurchIdentity(value) &&
    hasNullableStringFields(value, [
      "timezone",
      "bio",
      "city",
      "state_or_province",
      "country_code",
    ]) &&
    isNonNegativeSafeInteger(value.active_member_count)
  )
}
