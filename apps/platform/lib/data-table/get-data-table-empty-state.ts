import type { DataTableEmptyState } from "./_types"

export function getDataTableEmptyState(input: {
  isFetching: boolean
  hasError: boolean
  isUnfilteredEmpty: boolean
}): DataTableEmptyState {
  if (input.isFetching) return "loading"
  if (input.hasError) return "error"
  return input.isUnfilteredEmpty ? "empty" : "not-found"
}
