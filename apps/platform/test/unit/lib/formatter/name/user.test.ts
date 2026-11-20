import { describe, expect, it } from "bun:test"

import { getUserDisplayName } from "@/lib/formatter/name/user"

describe("getUserDisplayName", () => {
  it("joins the available trimmed name parts", () => {
    expect(getUserDisplayName(" Ada ", "Lovelace ")).toBe("Ada Lovelace")
    expect(getUserDisplayName("Ada", null)).toBe("Ada")
  })

  it("uses a fallback when no name parts are available", () => {
    expect(getUserDisplayName("  ", null)).toBe("User")
  })
})
