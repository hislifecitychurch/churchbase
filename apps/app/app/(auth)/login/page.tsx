import type { Metadata } from "next"
import type { JSX } from "react"

import { LoginForm } from "@/components/pages/login/_form/login-form"

export const metadata: Metadata = {
  title: "Log in",
}

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-xs flex-col items-center">
        <h1 className="text-foreground font-serif text-lg font-normal">Log in to Churchbase</h1>
        <LoginForm />
      </div>
    </div>
  )
}
