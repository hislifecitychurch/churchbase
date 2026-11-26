import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "Overview",
}

export default function OverviewPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">Overview</h1>
      <p className="text-muted-foreground text-sm">Your church at a glance.</p>
    </div>
  )
}
