import type { Metadata } from "next"
import type { JSX } from "react"

import { ChurchDetails } from "@/components/pages/churches/_details/church-details"

export const metadata: Metadata = {
  title: "Church details",
}

type ChurchPageProps = {
  params: Promise<{ churchId: string }>
}

export default async function ChurchPage({ params }: ChurchPageProps): Promise<JSX.Element> {
  const { churchId } = await params
  return <ChurchDetails churchId={churchId} />
}
