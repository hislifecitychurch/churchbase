"use client"

import { use } from "react"
import type * as React from "react"

import { useChurches } from "@/hooks/api/churches/use-churches"
import { useChurchProfileCompletenessToast } from "@/hooks/api/churches/use-church-profile-completeness-toast"

import { Button } from "@packages/ui-w/shared/button/button"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"

import { BackToChurchesButton } from "@/components/pages/churches/[churchId]/_button/back-to-churches-button"
import { ChurchActionsButton } from "@/components/pages/churches/[churchId]/_button/church-actions-button"
import { ViewProfileButton } from "@/components/pages/churches/[churchId]/_button/view-profile-button"
import { UpdateChurchProfileDialog } from "@/components/pages/churches/[churchId]/_dialog/update-church-profile-dialog"
import { ViewChurchProfileDialog } from "@/components/pages/churches/[churchId]/_dialog/view-church-profile-dialog"
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
  const {
    isUpdateProfileOpen,
    isViewProfileOpen,
    onUpdateProfileOpenChange,
    onViewProfileOpenChange,
  } = useChurchProfileCompletenessToast(church)

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
        actions={
          <div className="flex shrink-0 items-center gap-2">
            <ViewProfileButton church={church} />
            <ChurchActionsButton onUpdateProfile={() => onUpdateProfileOpenChange(true)} />
          </div>
        }
        description={<code className="font-mono">{church.slug}</code>}
        title={church.name}
      />
      <ChurchSummaryCards
        activeMemberCount={church.active_member_count}
        ministryCount={church.ministry_count}
      />
      <Dialog onOpenChange={onUpdateProfileOpenChange} open={isUpdateProfileOpen}>
        {isUpdateProfileOpen ? (
          <UpdateChurchProfileDialog
            church={church}
            onUpdated={() => onUpdateProfileOpenChange(false)}
          />
        ) : null}
      </Dialog>
      <Dialog onOpenChange={onViewProfileOpenChange} open={isViewProfileOpen}>
        {isViewProfileOpen ? <ViewChurchProfileDialog church={church} /> : null}
      </Dialog>
    </section>
  )
}
