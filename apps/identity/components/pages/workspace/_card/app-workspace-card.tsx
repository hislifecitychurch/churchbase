"use client"

import type { JSX } from "react"

import { Badge } from "@packages/ui-w/shared/badge/badge"
import { Card } from "@packages/ui-w/shared/card/card"

type AppWorkspaceCardProps = {
  returnTo: string
  isLastUsed: boolean
}

export function AppWorkspaceCard({ returnTo, isLastUsed }: AppWorkspaceCardProps): JSX.Element {
  return (
    <a
      className="group focus-visible:ring-ring focus-visible:ring-offset-background block min-h-11 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      href={returnTo}
    >
      <Card className="group-hover:border-ring group-hover:bg-accent/40 group-focus-visible:border-ring h-full cursor-pointer justify-between gap-6 p-4 transition-colors sm:p-6">
        {isLastUsed && (
          <Badge className="absolute top-4 right-4" size="sm" variant="secondary">
            Last used
          </Badge>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-lg font-medium">App</h2>
          <p className="text-muted-foreground text-sm">
            Organize your church's work, care for members, and coordinate ministries.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">Available now</span>
      </Card>
    </a>
  )
}
