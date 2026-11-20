import { redirect } from "next/navigation"

import { env } from "@/lib/env"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>
}): Promise<never> {
  const params = await searchParams
  const identityURL = env.NEXT_PUBLIC_IDENTITY_URL
  const platformURL = env.NEXT_PUBLIC_PLATFORM_URL

  if (!identityURL || !platformURL) {
    throw new Error("NEXT_PUBLIC_IDENTITY_URL and NEXT_PUBLIC_PLATFORM_URL are required")
  }

  const destination = new URL("/login", identityURL)
  const returnTo =
    typeof params.returnTo === "string" ? params.returnTo : new URL("/", platformURL).toString()
  destination.searchParams.set("returnTo", returnTo)

  redirect(destination.toString())
}
