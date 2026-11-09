import type { JSX } from "react"
import { notFound } from "next/navigation"

import { mainMenuItemsByMinistry } from "@/data/menu"
import { ministries } from "@/data/ministries"

type MinistryPageProps = {
  params: Promise<{ ministry: string }>
}

export default async function MinistryOverviewPage({
  params,
}: MinistryPageProps): Promise<JSX.Element> {
  const { ministry: slug } = await params
  const ministry = ministries.find((item) => item.slug === slug)
  const hasOverviewRoute = (mainMenuItemsByMinistry[slug] ?? []).some(
    (item) => item.path === `/ministries/${slug}`,
  )

  if (!ministry || slug === "churchbase" || !hasOverviewRoute) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">{ministry.name}</h1>
      <p className="text-muted-foreground text-sm">
        Overview and ministry activity will live here.
      </p>
    </div>
  )
}
