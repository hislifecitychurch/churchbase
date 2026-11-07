import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { env } from "@/lib/env"

const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
  basePath: "/api/v1/auth",
  fetchOptions: { credentials: "include" },
  plugins: [usernameClient({ displayUsername: false })],
})

export async function signIn(identifier: string, password: string): Promise<boolean> {
  const value = identifier.trim()
  const result = value.includes("@")
    ? await authClient.signIn.email({ email: value, password })
    : await authClient.signIn.username({ username: value, password })

  return !result.error
}
