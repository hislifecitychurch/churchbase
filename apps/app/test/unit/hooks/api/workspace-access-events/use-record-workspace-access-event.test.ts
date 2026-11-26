import { describe, expect, it } from "bun:test"

import { ApiError } from "@/api/client"
import { shouldRetryWorkspaceAccessEvent } from "@/hooks/api/workspace-access-events/use-record-workspace-access-event"

describe("shouldRetryWorkspaceAccessEvent", () => {
  it("retries transient failures up to two times", () => {
    expect(shouldRetryWorkspaceAccessEvent(0, new ApiError(503))).toBe(true)
    expect(shouldRetryWorkspaceAccessEvent(1, new ApiError(0))).toBe(true)
    expect(shouldRetryWorkspaceAccessEvent(2, new ApiError(503))).toBe(false)
  })

  it("does not retry client errors", () => {
    expect(shouldRetryWorkspaceAccessEvent(0, new ApiError(401))).toBe(false)
    expect(shouldRetryWorkspaceAccessEvent(0, new ApiError(403))).toBe(false)
  })
})
