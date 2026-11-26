export function formatUserName(firstName?: string | null, lastName?: string | null): string {
  const parts = [firstName, lastName].map((part) => part?.trim()).filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : "User"
}
