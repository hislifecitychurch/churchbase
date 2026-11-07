import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const baseURL = process.env.NEXT_PUBLIC_AUTH_URL

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_AUTH_URL is required")
}

const authClient = createAuthClient({
  baseURL,
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
