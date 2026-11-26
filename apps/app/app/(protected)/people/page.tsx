import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "People",
}

export default function PeoplePage(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">People</h1>
      <p className="text-muted-foreground text-sm">Member records will live here.</p>
    </div>
  )
}
