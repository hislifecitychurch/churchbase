"use client"

import { use } from "react"
import type * as React from "react"

import { ApiError } from "@/api/client"
import { useGetById } from "@/hooks/api/churches/use-get-by-id"
import { Button } from "@packages/ui-w/shared/button/button"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"

import { AddMinistryButton } from "@/components/pages/churches/[churchId]/_button/add-ministry-button"
import { BackToChurchesButton } from "@/components/pages/churches/[churchId]/_button/back-to-churches-button"
import { ChurchActionsButton } from "@/components/pages/churches/[churchId]/_button/church-actions-button"
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
  const churchQuery = useGetById(churchId)
  const church = churchQuery.data
  const openProfileDialog = churchQuery.profileDialogRequest
  const setOpenProfileDialog = churchQuery.setProfileDialogRequest
  const isUpdateProfileOpen =
    openProfileDialog?.churchId === church?.id && openProfileDialog?.mode === "update"
  const isViewProfileOpen =
    openProfileDialog?.churchId === church?.id && openProfileDialog?.mode === "view"
  function onUpdateProfileOpenChange(open: boolean): void {
    setOpenProfileDialog(open && church ? { churchId: church.id, mode: "update" } : null)
  }

  function onViewProfileOpenChange(open: boolean): void {
    setOpenProfileDialog(open && church ? { churchId: church.id, mode: "view" } : null)
  }

  if (churchQuery.isPending && !churchQuery.data) {
    return <LoadingSpinner />
  }

  if (
    churchQuery.isError &&
    !churchQuery.data &&
    !(churchQuery.error instanceof ApiError && churchQuery.error.status === 404)
  ) {
    return (
      <section className="flex flex-col items-start gap-4">
        <BackToChurchesButton />
        <p className="text-destructive" role="alert">
          We couldn't load this church.
        </p>
        <Button
          onClick={() => void churchQuery.refetch()}
          size="lg"
          type="button"
          variant="outline"
        >
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
            <AddMinistryButton />
            <ChurchActionsButton
              onUpdateProfile={() => onUpdateProfileOpenChange(true)}
              onViewProfile={() => onViewProfileOpenChange(true)}
            />
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
