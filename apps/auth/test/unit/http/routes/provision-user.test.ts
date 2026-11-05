import { describe, expect, it } from "bun:test"
import { APIError } from "better-auth/api"
import { Hono } from "hono"

import { registerProvisionUserRoute } from "../../../../src/http/routes/provision-user"

const token = "01234567890123456789012345678901"
const validUser = {
  email: "admin@example.org",
  name: "Ada Lovelace",
  password: "strong-password",
}

function appFor(
  serviceToken: string | undefined,
  provisionUser: (input: typeof validUser) => Promise<string>,
): Hono {
  const app = new Hono()
  registerProvisionUserRoute(app, serviceToken, provisionUser)
  return app
}

describe("POST /internal/provision-user", () => {
  it("requires the configured service token", async () => {
    let called = false
    const app = appFor(token, async () => {
      called = true
      return "auth-user-1"
    })

    const response = await app.request("/internal/provision-user", {
      method: "POST",
      headers: { authorization: `Bearer ${"x".repeat(32)}` },
      body: JSON.stringify(validUser),
    })

    expect(response.status).toBe(401)
    expect(called).toBe(false)
  })

  it("rejects invalid input before creating an identity", async () => {
    let called = false
    const app = appFor(token, async () => {
      called = true
      return "auth-user-1"
    })

    const response = await app.request("/internal/provision-user", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...validUser, password: "short" }),
    })

    expect(response.status).toBe(400)
    expect(called).toBe(false)
  })

  it("rejects malformed JSON", async () => {
    const app = appFor(token, async () => "auth-user-1")
    const response = await app.request("/internal/provision-user", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: "{",
    })

    expect(response.status).toBe(400)
  })

  it("creates the identity and returns only its opaque ID", async () => {
    let received: typeof validUser | undefined
    const app = appFor(token, async (input) => {
      received = input
      return "auth-user-1"
    })

    const response = await app.request("/internal/provision-user", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...validUser, role: "admin" }),
    })

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ authUserId: "auth-user-1" })
    expect(received).toEqual(validUser)
  })

  it("sanitizes BetterAuth conflicts", async () => {
    const app = appFor(token, async () => {
      throw new APIError("BAD_REQUEST", { message: "already exists" })
    })
    const response = await app.request("/internal/provision-user", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(validUser),
    })

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: "Auth rejected user details" })
  })

  it("fails closed when provisioning is not configured", async () => {
    const app = appFor(undefined, async () => "auth-user-1")
    const response = await app.request("/internal/provision-user", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(validUser),
    })

    expect(response.status).toBe(503)
  })
})
