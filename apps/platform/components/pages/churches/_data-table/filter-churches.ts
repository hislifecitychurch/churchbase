import type { Church } from "@/api/churches/list"

export function filterChurchesByName(churches: Church[], search: string): Church[] {
  const query = search.trim().toLowerCase()

  return query ? churches.filter((church) => church.name.toLowerCase().includes(query)) : churches
}
