import { describe, expect, it } from "bun:test"

import { getSessionVerificationAction } from "@/lib/auth-recovery"

describe("getSessionVerificationAction", () => {
  it("offers retry until three user retries have failed", () => {
    expect(getSessionVerificationAction(0)).toBe("retry")
    expect(getSessionVerificationAction(1)).toBe("retry")
    expect(getSessionVerificationAction(2)).toBe("retry")
    expect(getSessionVerificationAction(3)).toBe("sign-in")
    expect(getSessionVerificationAction(4)).toBe("sign-in")
  })
})
