import type { Metadata } from "next"
import type { JSX } from "react"

import { ChurchesTable } from "@/components/pages/churches/churches-table"

export const metadata: Metadata = {
  title: "Churches",
}

export default function ChurchesPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-2xl font-medium">Churches</h1>
        <p className="text-muted-foreground text-sm">Review the churches in your deployment.</p>
      </div>
      <ChurchesTable />
    </section>
  )
}
