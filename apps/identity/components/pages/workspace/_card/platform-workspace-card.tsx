"use client"

import type { JSX } from "react"

import { Badge } from "@packages/ui-w/shared/badge/badge"
import { Card } from "@packages/ui-w/shared/card/card"

export function PlatformWorkspaceCard({ isLastUsed }: { isLastUsed: boolean }): JSX.Element {
  return (
    <Card className="bg-muted/32 justify-between gap-6 p-4 sm:p-6">
      {isLastUsed && (
        <Badge className="absolute top-4 right-4" size="sm" variant="secondary">
          Last used
        </Badge>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-muted-foreground text-lg font-medium">Platform</h2>
        <p className="text-muted-foreground text-sm">
          The platform workspace is not available yet.
        </p>
      </div>
      <span className="text-muted-foreground text-sm">Coming soon</span>
    </Card>
  )
}
