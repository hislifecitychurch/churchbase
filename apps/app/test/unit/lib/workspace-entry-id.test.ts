import { afterEach, describe, expect, it } from "bun:test"

import { getWorkspaceEntryID } from "@/lib/workspace-entry-id"

const originalSessionStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage")
const originalPerformance = Object.getOwnPropertyDescriptor(globalThis, "performance")
const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, "crypto")
const values = new Map<string, string>()
let generatedID = 0
let navigationType: string = "navigate"

function setBrowserMocks(): void {
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  })
  Object.defineProperty(globalThis, "performance", {
    configurable: true,
    value: { getEntriesByType: () => [{ type: navigationType }] },
  })
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: { randomUUID: () => `entry-${++generatedID}` },
  })
}

afterEach(() => {
  values.clear()
  generatedID = 0
  navigationType = "navigate"
  for (const [name, descriptor] of [
    ["sessionStorage", originalSessionStorage],
    ["performance", originalPerformance],
    ["crypto", originalCrypto],
  ] as const) {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor)
    } else {
      Reflect.deleteProperty(globalThis, name)
    }
  }
})

describe("getWorkspaceEntryID", () => {
  it("reuses the entry ID on refresh", () => {
    setBrowserMocks()
    values.set("churchbase:workspace-entry:app", "entry-existing")
    navigationType = "reload"

    expect(getWorkspaceEntryID("app")).toBe("entry-existing")
    expect(generatedID).toBe(0)
  })

  it("creates a new ID for a new workspace visit", () => {
    setBrowserMocks()
    values.set("churchbase:workspace-entry:app", "entry-previous")

    expect(getWorkspaceEntryID("app")).toBe("entry-1")
    expect(values.get("churchbase:workspace-entry:app")).toBe("entry-1")
  })
})
