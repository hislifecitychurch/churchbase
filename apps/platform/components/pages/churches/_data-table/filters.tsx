import type { Church } from "@/api/churches/get-all"

export const churchesDataTableSearch = {
  columnId: "name",
  placeholder: "Search churches...",
}

export function filterChurchesByName(churches: Church[], search: string): Church[] {
  const query = search.trim().toLowerCase()

  return query ? churches.filter((church) => church.name.toLowerCase().includes(query)) : churches
}
