"use client"

import type { JSX } from "react"

import { Button } from "@packages/ui-w/shared/button/button"
import { Card } from "@packages/ui-w/shared/card/card"

export function PlatformWorkspaceCard(): JSX.Element {
  return (
    <Card className="justify-between gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-lg font-medium">Platform</h2>
        <p className="text-muted-foreground text-sm">
          The platform workspace is not available yet.
        </p>
      </div>
      <Button className="w-full" disabled size="lg" type="button" variant="outline">
        Coming soon
      </Button>
    </Card>
  )
}
