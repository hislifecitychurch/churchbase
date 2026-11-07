"use client"

import type * as React from "react"
import { useState } from "react"

import { useSignIn } from "@/hooks/api/auth/use-sign-in"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"

import { ApiError } from "@/api/client"

import { getPostLoginDestination } from "@/lib/post-login-destination"

import { Button } from "@packages/ui-w/shared/button/button"
import { SpinnerFlicker18 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-18"

import { IdentifierField } from "@/components/pages/login/_form/login/_field/identifier-field"
import { PasswordField } from "@/components/pages/login/_form/login/_field/password-field"

type LoginFormProps = {
  returnTo: string
}

export function LoginForm({ returnTo }: LoginFormProps): React.ReactElement {
  const [identifier, setIdentifier] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const signInMutation = useSignIn()
  const currentUserQuery = useCurrentUser({ enabled: false })
  const isPending = signInMutation.isPending || currentUserQuery.isFetching

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    try {
      const authenticated = await signInMutation.mutateAsync({ identifier, password })

      if (!authenticated) {
        setErrorMessage("Email or username and password do not match.")
        return
      }

      const { data: currentUser } = await currentUserQuery.refetch({ throwOnError: true })

      if (!currentUser) {
        throw new Error("The current user could not be loaded.")
      }

      window.location.assign(getPostLoginDestination(currentUser.platform_role, returnTo))
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError && error.code === "user_not_provisioned"
          ? "Your sign-in isn't linked to a Churchbase account. Ask your administrator to provision access."
          : "We couldn't verify your Churchbase account. Please try again.",
      )
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
        {isPending && (
          <span className="sr-only" role="status">
            Signing in
          </span>
        )}
        <Button
          aria-busy={isPending}
          className="mt-1 w-full"
          disabled={isPending}
          size="lg"
          type="submit"
        >
          {isPending ? (
            <>
              <SpinnerFlicker18 aria-hidden="true" />
              <span className="sr-only">Signing in</span>
            </>
          ) : (
            "Continue"
          )}
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
