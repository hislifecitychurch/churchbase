import { describe, expect, it } from "bun:test"

import { getMainMenuItems, mainMenuItemsByMinistry } from "@/data/menu"
import { getMinistrySlugFromPath } from "@/lib/menu/get-ministry-slug-from-path"

const allCapabilities = Object.values(mainMenuItemsByMinistry).flatMap((items) =>
  items.map((item) => item.capability),
)

describe("ministry navigation", () => {
  it("derives ministry context from ministry routes and defaults global routes to church-wide", () => {
    expect(getMinistrySlugFromPath("/")).toBe("churchbase")
    expect(getMinistrySlugFromPath("/people")).toBe("churchbase")
    expect(getMinistrySlugFromPath("/ministries")).toBe("churchbase")
    expect(getMinistrySlugFromPath("/ministries/broadcast/services")).toBe("broadcast")
    expect(getMinistrySlugFromPath("/ministries/music/songs-and-setlists")).toBe("music")
    expect(getMinistrySlugFromPath("/ministries/kids/check-in")).toBe("kids")
    expect(getMinistrySlugFromPath("/ministries/unknown")).toBe("")
  })

  it("keeps each ministry's configured menu scoped to its dynamic routes", () => {
    for (const slug of ["broadcast", "music", "kids"]) {
      const items = getMainMenuItems(slug, allCapabilities)

      expect(items[0]?.path).toBe(`/ministries/${slug}`)
      expect(items.slice(1).every((item) => item.path.startsWith(`/ministries/${slug}/`))).toBe(
        true,
      )
    }

    expect(getMainMenuItems("unknown", allCapabilities)).toEqual([])
  })

  it("shows different Church-wide, leader, and member menus from API capabilities", () => {
    expect(
      getMainMenuItems("churchbase", ["church.overview.read", "church.people.read"]).map(
        (item) => item.title,
      ),
    ).toEqual(["Overview", "People"])
    expect(
      getMainMenuItems("churchbase", [
        "church.overview.read",
        "church.people.read",
        "church.ministries.read",
      ]).map((item) => item.title),
    ).toEqual(["Overview", "People", "Ministries"])
    expect(
      getMainMenuItems("broadcast", [
        "broadcast.overview.read",
        "broadcast.services.read",
        "broadcast.media.read",
      ]).map((item) => item.title),
    ).toEqual(["Overview", "Services", "Media"])
    expect(
      getMainMenuItems("broadcast", [
        "broadcast.overview.read",
        "broadcast.services.read",
        "broadcast.media.read",
        "broadcast.team.read",
      ]).map((item) => item.title),
    ).toEqual(["Overview", "Services", "Media", "Team"])
  })

  it("keeps Care and Kids check-in/safety hidden without explicit capabilities", () => {
    expect(
      getMainMenuItems("churchbase", [
        "church.overview.read",
        "church.people.read",
        "church.ministries.read",
      ]).map((item) => item.title),
    ).not.toContain("Care")
    expect(
      getMainMenuItems("kids", ["kids.overview.read", "kids.classes.read"]).map(
        (item) => item.title,
      ),
    ).toEqual(["Overview", "Classes"])
  })
})
