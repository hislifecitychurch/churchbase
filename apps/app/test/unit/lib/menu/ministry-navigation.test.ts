import { describe, expect, it } from "bun:test"

import { getMainMenuItems } from "@/data/menu/main"
import { getMinistrySlugFromPath } from "@/lib/menu/get-ministry-slug-from-path"

describe("ministry navigation", () => {
  it("derives ministry context from ministry routes and defaults global routes to church-wide", () => {
    expect(getMinistrySlugFromPath("/")).toBe("churchbase")
    expect(getMinistrySlugFromPath("/people")).toBe("churchbase")
    expect(getMinistrySlugFromPath("/ministries")).toBe("churchbase")
    expect(getMinistrySlugFromPath("/ministries/broadcast/services")).toBe("broadcast")
    expect(getMinistrySlugFromPath("/ministries/music/songs-and-setlists")).toBe("music")
    expect(getMinistrySlugFromPath("/ministries/kids/check-in")).toBe("kids")
    expect(getMinistrySlugFromPath("/ministries/unknown")).toBe("churchbase")
  })

  it("keeps each ministry's menu scoped to routes handled by its dynamic pages", () => {
    for (const slug of ["broadcast", "music", "kids"]) {
      const items = getMainMenuItems(slug)

      expect(items[0]?.path).toBe(`/ministries/${slug}`)
      expect(items.slice(1).every((item) => item.path.startsWith(`/ministries/${slug}/`))).toBe(
        true,
      )
    }

    expect(getMainMenuItems("unknown")).toEqual(getMainMenuItems("churchbase"))
  })
})
