import { describe, expect, it } from "bun:test"

import { getProfileCompletenessToastAction } from "@/lib/churches/get-profile-completeness-toast-action"

describe("getProfileCompletenessToastAction", () => {
  it("does not show an action for a complete profile", () => {
    expect(getProfileCompletenessToastAction(true, true)).toBeNull()
  })

  it("lets admins complete an incomplete profile", () => {
    expect(getProfileCompletenessToastAction(false, true)).toEqual({
      label: "Complete profile",
      mode: "update",
    })
  })

  it("lets other users view an incomplete profile", () => {
    expect(getProfileCompletenessToastAction(false, false)).toEqual({
      label: "View profile",
      mode: "view",
    })
  })
})
