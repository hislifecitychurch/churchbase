export type DataTableEmptyState = "loading" | "error" | "not-found" | "empty"

export function getDataTableEmptyState(input: {
  isFetching: boolean
  hasError: boolean
  isUnfilteredEmpty: boolean
}): DataTableEmptyState {
  if (input.isFetching) return "loading"
  if (input.hasError) return "error"
  return input.isUnfilteredEmpty ? "empty" : "not-found"
}
