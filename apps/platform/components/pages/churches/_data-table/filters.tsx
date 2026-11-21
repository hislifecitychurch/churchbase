import type { ChurchSummary } from "@/api/churches/types"

export const churchesDataTableSearch = {
  columnId: "name",
  placeholder: "Search churches...",
}

export function filterChurchesByName(churches: ChurchSummary[], search: string): ChurchSummary[] {
  const query = search.trim().toLowerCase()

  return query ? churches.filter((church) => church.name.toLowerCase().includes(query)) : churches
}
