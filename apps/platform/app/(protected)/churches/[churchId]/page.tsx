"use client"

import { use } from "react"
import type * as React from "react"

import { useChurches } from "@/hooks/api/churches/use-churches"

import { Button } from "@packages/ui-w/shared/button/button"

import { BackToChurchesButton } from "@/components/pages/churches/[churchId]/_button/back-to-churches-button"
import { ChurchSummaryCards } from "@/components/pages/churches/[churchId]/_card/church-summary-cards"
import { PageHeader } from "@/components/shared/_header/page-header"
import { LoadingSpinner } from "@/components/shared/_spinner/loading-spinner"

type ChurchPageProps = {
  params: Promise<{ churchId: string }>
}

export default function ChurchPage({ params }: ChurchPageProps): React.ReactElement {
  const { churchId } = use(params)
  const churches = useChurches()
  const church = churches.data?.find((item) => item.id === churchId)

  if (churches.isPending && !churches.data) {
    return <LoadingSpinner />
  }

  if (churches.isError && !churches.data) {
    return (
      <section className="flex flex-col items-start gap-4">
        <BackToChurchesButton />
        <p className="text-destructive" role="alert">
          We couldn't load this church.
        </p>
        <Button onClick={() => void churches.refetch()} size="lg" type="button" variant="outline">
          Try again
        </Button>
      </section>
    )
  }

  if (!church) {
    return (
      <section className="flex flex-col items-start gap-4">
        <BackToChurchesButton />
        <p className="text-muted-foreground">Church not found.</p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <BackToChurchesButton />
      <PageHeader
        description={<code className="font-mono">{church.slug}</code>}
        title={church.name}
      />
      <ChurchSummaryCards
        activeMemberCount={church.active_member_count}
        ministryCount={church.ministry_count}
      />
    </section>
  )
}
