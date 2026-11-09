import { describe, expect, it } from "bun:test"

import type { AccessContext } from "@/api/access-contexts"
import {
  canAccessPath,
  contextHomePath,
  isConfiguredAccessPath,
  getAccessContextForPath,
  pathWithContext,
} from "@/lib/access-contexts"

const churchContext: AccessContext = {
  id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
  church_id: "018f47b8-8cb2-7d15-b28e-4a26843d81c1",
  kind: "church",
  slug: "churchbase",
  name: "Church-wide",
  church_name: "Sample Church",
  role: "staff",
  capabilities: ["church.overview.read", "church.people.read"],
}

const kidsContext: AccessContext = {
  id: "018f47b8-8cb2-7d15-b28e-4a26843d81c2",
  church_id: churchContext.church_id,
  kind: "ministry",
  slug: "kids",
  name: "Kids",
  church_name: churchContext.church_name,
  role: "member",
  capabilities: ["kids.overview.read", "kids.classes.read"],
}

describe("access contexts", () => {
  it("only allows routes present in the selected context's capabilities", () => {
    const contexts = [churchContext, kidsContext]
    expect(canAccessPath(contexts, "/people", churchContext.id)).toBe(true)
    expect(canAccessPath(contexts, "/ministries", churchContext.id)).toBe(false)
    expect(canAccessPath(contexts, "/ministries/kids/classes", kidsContext.id)).toBe(true)
    expect(canAccessPath(contexts, "/ministries/kids/check-in", kidsContext.id)).toBe(false)
  })

  it("does not fall back when a URL selects a context that is not granted", () => {
    const context = getAccessContextForPath([churchContext, kidsContext], "/", kidsContext.id)
    expect(context).toBeNull()
    expect(canAccessPath([churchContext, kidsContext], "/", kidsContext.id)).toBe(false)
  })

  it("distinguishes configured menu routes from framework 404s", () => {
    expect(isConfiguredAccessPath("/ministries/kids/classes")).toBe(true)
    expect(isConfiguredAccessPath("/ministries/kids/unknown")).toBe(false)
    expect(isConfiguredAccessPath("/ministries/kids/classes/123")).toBe(false)
  })

  it("keeps personal settings available without a ministry context", () => {
    expect(canAccessPath([], "/settings", null)).toBe(true)
  })

  it("builds stable context routes for refreshes and workspace selection", () => {
    expect(contextHomePath(churchContext)).toBe("/")
    expect(contextHomePath(kidsContext)).toBe("/ministries/kids")
    expect(pathWithContext("/ministries/kids/classes", kidsContext.id)).toBe(
      `/ministries/kids/classes?context_id=${kidsContext.id}`,
    )
    expect(pathWithContext("/people", kidsContext.id, "search=ada&context_id=old")).toBe(
      `/people?search=ada&context_id=${kidsContext.id}`,
    )
  })
})
