import type { JSX } from "react"
import { notFound } from "next/navigation"

import { mainMenuItemsByMinistry } from "@/data/menu"
import { ministries } from "@/data/ministries"

type MinistrySectionPageProps = {
  params: Promise<{ ministry: string; section: string }>
}

export default async function MinistrySectionPage({
  params,
}: MinistrySectionPageProps): Promise<JSX.Element> {
  const { ministry: slug, section } = await params
  const ministry = ministries.find((item) => item.slug === slug)
  const page = (mainMenuItemsByMinistry[slug] ?? []).find(
    (item) => item.path === `/ministries/${slug}/${section}`,
  )

  if (!ministry || slug === "churchbase" || !page) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">{page.title}</h1>
      <p className="text-muted-foreground text-sm">
        {page.title} for the {ministry.name} ministry will live here.
      </p>
    </div>
  )
}
