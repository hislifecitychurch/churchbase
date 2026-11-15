import type { Metadata } from "next"
import type { JSX } from "react"

import { ChurchesDataTable } from "@/components/pages/churches/_data-table/churches-data-table"
import { PageHeader } from "@/components/shared/_header/page-header"

export const metadata: Metadata = {
  title: "Churches",
}

export default function ChurchesPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader description="Review the churches in your deployment." title="Churches" />
      <ChurchesDataTable />
    </section>
  )
}
