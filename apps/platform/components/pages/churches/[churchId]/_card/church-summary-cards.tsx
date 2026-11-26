import type * as React from "react"

import { Card } from "@packages/ui-w/shared/card/card"

type ChurchSummaryCardsProps = {
  activeMemberCount: number
  ministryCount: number
}

export function ChurchSummaryCards({
  activeMemberCount,
  ministryCount,
}: ChurchSummaryCardsProps): React.ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
      <Card className="gap-2 p-4">
        <h2 className="text-muted-foreground text-sm">Active members</h2>
        <p className="text-2xl font-medium">{activeMemberCount.toLocaleString()}</p>
      </Card>
      <Card className="gap-2 p-4">
        <h2 className="text-muted-foreground text-sm">Ministries</h2>
        <p className="text-2xl font-medium">{ministryCount.toLocaleString()}</p>
      </Card>
      <Card className="gap-2 p-4">
        <h2 className="text-muted-foreground text-sm">Attendees</h2>
        <p className="text-2xl font-medium">—</p>
        <p className="text-muted-foreground text-sm">Attendance isn’t tracked yet.</p>
      </Card>
    </div>
  )
}
