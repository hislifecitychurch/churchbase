"use client"

import { use, useEffect, useState } from "react"
import type * as React from "react"

import { ApiError } from "@/api/client"
import { useChurch } from "@/hooks/api/churches/use-church"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { getProfileCompletenessToastAction } from "@/lib/churches/get-profile-completeness-toast-action"

import { toastManager } from "@packages/ui-w/providers/toast-provider"
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

type ProfileDialog = { churchId: string; mode: "view" | "update" } | null

export default function ChurchPage({ params }: ChurchPageProps): React.ReactElement {
  const { churchId } = use(params)
  const churchQuery = useChurch(churchId)
  const church = churchQuery.data
  const currentUser = useCurrentUser()
  const canUpdateProfile = currentUser.data?.global_roles === "admin"
  const [openProfileDialog, setOpenProfileDialog] = useState<ProfileDialog>(null)
  const isUpdateProfileOpen =
    openProfileDialog?.churchId === church?.id && openProfileDialog?.mode === "update"
  const isViewProfileOpen =
    openProfileDialog?.churchId === church?.id && openProfileDialog?.mode === "view"
  const churchProfileId = church?.id
  const isProfileComplete = church?.profile_complete

  useEffect(() => {
    if (!churchProfileId || isProfileComplete === undefined) return

    const toastId = `church-profile-incomplete-${churchProfileId}`
    const action = getProfileCompletenessToastAction(isProfileComplete, canUpdateProfile)
    if (!action) {
      toastManager.close(toastId)
      return
    }

    toastManager.add({
      id: toastId,
      type: "warning",
      timeout: 0,
      title: "Church profile is incomplete",
      description: "Review or add the missing profile information.",
      actionProps: {
        children: action.label,
        onClick: () => {
          toastManager.close(toastId)
          setOpenProfileDialog({ churchId: churchProfileId, mode: action.mode })
        },
      },
    })

    return () => toastManager.close(toastId)
  }, [canUpdateProfile, churchProfileId, isProfileComplete])

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
