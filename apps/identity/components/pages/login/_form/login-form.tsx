"use client"

import type * as React from "react"
import { useState } from "react"

import { Button } from "@packages/ui-w/shared/button/button"

import { signIn } from "@/lib/auth-client"
import { IdentifierField } from "@/components/pages/login/_field/identifier-field"
import { PasswordField } from "@/components/pages/login/_field/password-field"

type LoginFormProps = {
  returnTo: string
}

export function LoginForm({ returnTo }: LoginFormProps): React.ReactElement {
  const [identifier, setIdentifier] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isPending, setIsPending] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)
    setIsPending(true)

    try {
      const authenticated = await signIn(identifier, password)

      if (!authenticated) {
        setErrorMessage("Email or username and password do not match.")
        return
      }

      window.location.assign(returnTo)
    } catch {
      setErrorMessage("The sign-in service is unavailable. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mt-8 flex w-full flex-col items-center">
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <IdentifierField
          disabled={isPending}
          onChange={(event) => setIdentifier(event.target.value)}
          value={identifier}
        />
        <PasswordField
          disabled={isPending}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        {errorMessage && (
          <p className="text-destructive text-sm" role="alert">
            {errorMessage}
          </p>
        )}
        <Button className="mt-1 w-full" disabled={isPending} size="lg" type="submit">
          {isPending ? "Signing in…" : "Continue"}
        </Button>
      </form>
      <Button
        className="text-muted-foreground hover:text-foreground mt-4 h-auto p-0 font-normal"
        disabled
        size="sm"
        type="button"
        variant="link"
      >
        Forgot your password?
      </Button>
    </div>
  )
}
