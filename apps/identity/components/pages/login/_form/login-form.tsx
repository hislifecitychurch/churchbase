"use client"

import type * as React from "react"
import { useState } from "react"

import { Button } from "@packages/ui-w/shared/button/button"

import { IdentifierField } from "@/components/pages/login/_field/identifier-field"
import { PasswordField } from "@/components/pages/login/_field/password-field"

export function LoginForm(): React.ReactElement {
  const [identifier, setIdentifier] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  // Presentation only: authentication is not wired up yet.
  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault()
  }

  return (
    <div className="mt-8 flex w-full flex-col items-center">
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <IdentifierField
          onChange={(event) => setIdentifier(event.target.value)}
          value={identifier}
        />
        <PasswordField onChange={(event) => setPassword(event.target.value)} value={password} />
        <Button className="mt-1 w-full" size="lg" type="submit">
          Continue
        </Button>
      </form>
      <Button
        className="text-muted-foreground hover:text-foreground mt-4 h-auto p-0 font-normal"
        size="sm"
        type="button"
        variant="link"
      >
        Forgot your password?
      </Button>
    </div>
  )
}
