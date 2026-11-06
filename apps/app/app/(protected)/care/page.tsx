import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "Care",
}

export default function CarePage(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">Care</h1>
      <p className="text-muted-foreground text-sm">Follow-ups and care requests will live here.</p>
    </div>
  )
}
