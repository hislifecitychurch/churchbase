import { Lora } from "next/font/google"
import Image from "next/image"
import type { Metadata } from "next"
import type { JSX } from "react"

import { getConfiguredReturnURL } from "@/lib/return-url"

import { LoginForm } from "@/components/pages/login/_form/login/login-form"

export const metadata: Metadata = {
  title: "Log in",
}

const lora = Lora({ subsets: ["latin"] })

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
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-center gap-2 px-4 py-4 sm:px-6">
        <Image
          src="/logo/churchbase-light-transparent.webp"
          alt=""
          width={48}
          height={48}
          className="size-8 shrink-0 object-contain dark:hidden"
        />
        <Image
          src="/logo/churchbase-dark-transparent.webp"
          alt=""
          width={48}
          height={48}
          className="hidden size-8 shrink-0 object-contain dark:block"
        />
        <h1 className={`${lora.className} text-foreground text-2xl font-normal tracking-normal`}>
          Churchbase
        </h1>
      </header>
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
