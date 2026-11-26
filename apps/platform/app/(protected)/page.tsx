import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "Overview",
}

export default function PlatformPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-foreground text-2xl font-medium">Overview</h1>
      <p className="text-muted-foreground text-sm">
        Deployment-wide administration for Churchbase.
      </p>
    </section>
  )
}
