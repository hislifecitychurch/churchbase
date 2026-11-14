import { describe, expect, it } from "bun:test"

import { getDataTableEmptyState } from "@/lib/data-table/empty-state"

const settled = { isFetching: false, hasError: false }

describe("getDataTableEmptyState", () => {
  it("distinguishes an empty directory from a view with no results", () => {
    expect(getDataTableEmptyState({ ...settled, isUnfilteredEmpty: true })).toBe("empty")
    expect(getDataTableEmptyState({ ...settled, isUnfilteredEmpty: false })).toBe("not-found")
  })

  it("prioritizes loading, then error, over empty states", () => {
    expect(
      getDataTableEmptyState({
        isFetching: true,
        hasError: true,
        isUnfilteredEmpty: false,
      }),
    ).toBe("loading")
    expect(
      getDataTableEmptyState({
        ...settled,
        hasError: true,
        isUnfilteredEmpty: false,
      }),
    ).toBe("error")
  })
})
