import { IconBuildingChurch } from "@tabler/icons-react"
import type { Metadata } from "next"
import type { JSX } from "react"

import { LoginForm } from "@/components/pages/login/_form/login-form"

export const metadata: Metadata = {
  title: "Log in",
}

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-56 flex-col items-center">
        <IconBuildingChurch aria-hidden className="text-foreground size-8" stroke={1.5} />
        <h1 className="text-foreground mt-6 text-lg font-semibold tracking-tight">
          Log in to Churchbase
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
