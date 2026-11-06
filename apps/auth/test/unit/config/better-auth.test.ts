import { describe, expect, it } from "bun:test"

import { loadBetterAuthConfig } from "../../../config/better-auth"

const baseEnvironment = {
  ENVIRONMENT: "development",
  BETTER_AUTH_SECRET: "better-auth-secret-at-least-32-characters",
  BETTER_AUTH_URL: "http://localhost:36081",
}

describe("loadBetterAuthConfig", () => {
  it("allows provisioning to remain disabled when no service token is set", () => {
    const config = loadBetterAuthConfig(baseEnvironment)
    expect(config.serviceToken).toBeUndefined()
  })

  it("requires a sufficiently long token when provisioning is enabled", () => {
    expect(() =>
      loadBetterAuthConfig({ ...baseEnvironment, AUTH_SERVICE_TOKEN: "too-short" }),
    ).toThrow()
  })
})
