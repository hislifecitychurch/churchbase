"use client"

import type { JSX } from "react"

import { Button } from "@packages/ui-w/shared/button/button"
import { Card } from "@packages/ui-w/shared/card/card"

type AppWorkspaceCardProps = {
  returnTo: string
}

export function AppWorkspaceCard({ returnTo }: AppWorkspaceCardProps): JSX.Element {
  return (
    <Card className="justify-between gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-lg font-medium">App</h2>
        <p className="text-muted-foreground text-sm">
          Organize your church's work, care for members, and coordinate ministries.
        </p>
      </div>
      <Button
        className="w-full"
        onClick={() => window.location.assign(returnTo)}
        size="lg"
        type="button"
      >
        Open App
      </Button>
    </Card>
  )
}
