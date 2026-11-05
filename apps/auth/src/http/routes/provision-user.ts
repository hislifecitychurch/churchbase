import { timingSafeEqual } from "node:crypto"
import { isAPIError } from "better-auth/api"
import type { Hono } from "hono"
import { z } from "zod"

export type ProvisionUserInput = {
  email: string
  name: string
  password: string
}

export type ProvisionUser = (input: ProvisionUserInput) => Promise<string>

const provisionUserSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  name: z.string().trim().min(1).max(255),
  password: z.string().min(12).max(128),
})

export function registerProvisionUserRoute(
  app: Hono,
  serviceToken: string | undefined,
  provisionUser: ProvisionUser,
): void {
  app.post("/internal/provision-user", async (context) => {
    if (!serviceToken) return context.json({ error: "Provisioning is not configured" }, 503)
    if (!hasServiceToken(context.req.header("authorization"), serviceToken)) {
      return context.json({ error: "Unauthorized" }, 401)
    }

    let body: unknown
    try {
      body = await context.req.json()
    } catch {
      return context.json({ error: "Invalid request" }, 400)
    }

    const parsed = provisionUserSchema.safeParse(body)
    if (!parsed.success) return context.json({ error: "Invalid user details" }, 400)

    try {
      const authUserId = await provisionUser(parsed.data)
      return context.json({ authUserId }, 201)
    } catch (error) {
      if (isAPIError(error) && error.statusCode < 500) {
        return context.json({ error: "Auth rejected user details" }, 409)
      }
      return context.json({ error: "Unable to provision Auth user" }, 500)
    }
  })
}

function hasServiceToken(authorization: string | undefined, expected: string): boolean {
  if (!authorization?.startsWith("Bearer ")) return false

  const received = Buffer.from(authorization.slice("Bearer ".length))
  const expectedBytes = Buffer.from(expected)
  return received.length === expectedBytes.length && timingSafeEqual(received, expectedBytes)
}
