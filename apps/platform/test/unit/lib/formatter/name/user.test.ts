import { describe, expect, it } from "bun:test"

import { formatUserName } from "@/lib/formatter/name/user"

describe("formatUserName", () => {
  it("joins the available trimmed name parts", () => {
    expect(formatUserName(" Ada ", "Lovelace ")).toBe("Ada Lovelace")
    expect(formatUserName("Ada", null)).toBe("Ada")
  })

  it("uses a fallback when no name parts are available", () => {
    expect(formatUserName("  ", null)).toBe("User")
  })
})
