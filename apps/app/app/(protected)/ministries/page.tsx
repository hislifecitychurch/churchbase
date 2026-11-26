import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "Ministries",
}

export default function MinistriesPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">Ministries</h1>
      <p className="text-muted-foreground text-sm">Ministry teams and schedules will live here.</p>
    </div>
  )
}
