import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "Churches",
}

export default function ChurchesPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-foreground text-2xl font-medium">Churches</h1>
      <p className="text-muted-foreground text-sm">Church management will be added here.</p>
    </section>
  )
}
