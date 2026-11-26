"use client"

import type * as React from "react"

import { useAuthSession } from "@/hooks/api/auth/use-auth-session"
import { useSignOut } from "@/hooks/api/auth/use-sign-out"

import { Button } from "@packages/ui-w/shared/button/button"

export function WorkspaceSignOutButton(): React.ReactElement {
  const session = useAuthSession()
  const signOutMutation = useSignOut()
  const email = session.data?.user.email

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-1.5">
        <p className="text-muted-foreground text-sm">
          Logged in as <span className="text-foreground break-all">{email || "your account"}</span>.
        </p>
        <Button
          aria-busy={signOutMutation.isPending}
          className="h-auto p-0 font-normal"
          disabled={signOutMutation.isPending}
          onClick={() =>
            signOutMutation.mutate(undefined, {
              onSuccess: () => window.location.replace("/login"),
            })
          }
          size="sm"
          type="button"
          variant="link"
        >
          {signOutMutation.isPending ? "Signing out…" : "Not you? Sign out"}
        </Button>
      </div>
      {signOutMutation.isError ? (
        <p className="text-destructive text-sm" role="alert">
          We couldn&apos;t sign you out. Please try again.
        </p>
      ) : null}
    </div>
  )
}
