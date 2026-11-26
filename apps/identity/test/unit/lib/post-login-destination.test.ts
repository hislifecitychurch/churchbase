import { describe, expect, it } from "bun:test"

import { getPostLoginDestination } from "@/lib/post-login-destination"

const returnTo = "http://localhost:36002/people?view=active"

describe("getPostLoginDestination", () => {
  it.each(["admin", "staff"] as const)("sends %s to the workspace chooser", (role) => {
    const destination = getPostLoginDestination(role, returnTo)
    const url = new URL(destination, "http://localhost:36000")

    expect(url.pathname).toBe("/workspace")
    expect(url.searchParams.get("returnTo")).toBe(returnTo)
  })

  it("sends a regular user to the requested App destination", () => {
    expect(getPostLoginDestination(null, returnTo)).toBe(returnTo)
  })
})
