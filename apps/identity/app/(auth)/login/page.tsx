import type { Metadata } from "next"
import type { JSX } from "react"

import { getConfiguredReturnURL } from "@/lib/return-url"

import { BrandHeader } from "@/components/shared/_header/brand-header"
import { LoginForm } from "@/components/pages/login/_form/login/login-form"

export const metadata: Metadata = {
  title: "Log in",
}

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps): Promise<JSX.Element> {
  const params = await searchParams
  const returnTo = getConfiguredReturnURL(
    typeof params.returnTo === "string" ? params.returnTo : undefined,
  )

  return (
    <>
      <BrandHeader />
      <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-xs flex-col items-center">
          <p className="text-muted-foreground mt-2 text-center text-sm text-balance">
            A shared foundation for church teams to organize their work, care for members, and
            coordinate ministries.
          </p>
          <LoginForm returnTo={returnTo} />
        </div>
      </div>
    </>
  )
}
