import { describe, expect, it } from "bun:test"

import { getMainMenuItems, mainMenuItemsByMinistry } from "@/data/menu"
import { getMinistryTypeFromPath } from "@/lib/menu/get-ministry-type-from-path"

const allCapabilities = Object.values(mainMenuItemsByMinistry).flatMap((items) =>
  items.map((item) => item.capability),
)

describe("ministry navigation", () => {
  it("derives ministry context from ministry routes and defaults global routes to church-wide", () => {
    expect(getMinistryTypeFromPath("/")).toBe("churchbase")
    expect(getMinistryTypeFromPath("/people")).toBe("churchbase")
    expect(getMinistryTypeFromPath("/ministries")).toBe("churchbase")
    expect(getMinistryTypeFromPath("/ministries/broadcast/services")).toBe("broadcast")
    expect(getMinistryTypeFromPath("/ministries/music/songs-and-setlists")).toBe("music")
    expect(getMinistryTypeFromPath("/ministries/kids/check-in")).toBe("kids")
    expect(getMinistryTypeFromPath("/ministries/unknown")).toBe("")
  })

  it("keeps each ministry's configured menu scoped to its dynamic routes", () => {
    for (const type of ["broadcast", "music", "kids"] as const) {
      const items = getMainMenuItems(type, allCapabilities)

      expect(items[0]?.path).toBe(`/ministries/${type}`)
      expect(items.slice(1).every((item) => item.path.startsWith(`/ministries/${type}/`))).toBe(
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
