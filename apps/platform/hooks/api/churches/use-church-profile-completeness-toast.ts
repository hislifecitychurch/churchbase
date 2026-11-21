"use client"

import { useCallback, useEffect, useState } from "react"

import type { Church } from "@/api/churches/get-all"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { getProfileCompletenessToastAction } from "@/lib/churches/get-profile-completeness-toast-action"

import { toastManager } from "@packages/ui-w/providers/toast-provider"

type ChurchProfileCompleteness = Pick<Church, "id" | "profile_complete">
type ProfileDialog = { churchId: string; mode: "view" | "update" } | null

export function useChurchProfileCompletenessToast(church: ChurchProfileCompleteness | undefined) {
  const [openProfileDialog, setOpenProfileDialog] = useState<ProfileDialog>(null)
  const currentUser = useCurrentUser()
  const canUpdateProfile = currentUser.data?.global_roles === "admin"
  const churchId = church?.id
  const profileComplete = church?.profile_complete

  useEffect(() => {
    if (!churchId || profileComplete === undefined) return

    const toastId = `church-profile-incomplete-${churchId}`
    const action = getProfileCompletenessToastAction(profileComplete, canUpdateProfile)
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
          setOpenProfileDialog({ churchId, mode: action.mode })
        },
      },
    })

    return () => toastManager.close(toastId)
  }, [canUpdateProfile, churchId, profileComplete])

  const onUpdateProfileOpenChange = useCallback(
    (open: boolean) =>
      setOpenProfileDialog(open && church ? { churchId: church.id, mode: "update" } : null),
    [church?.id],
  )
  const onViewProfileOpenChange = useCallback(
    (open: boolean) =>
      setOpenProfileDialog(open && church ? { churchId: church.id, mode: "view" } : null),
    [church?.id],
  )

  return {
    isUpdateProfileOpen:
      openProfileDialog?.churchId === church?.id && openProfileDialog?.mode === "update",
    isViewProfileOpen:
      openProfileDialog?.churchId === church?.id && openProfileDialog?.mode === "view",
    onUpdateProfileOpenChange,
    onViewProfileOpenChange,
  }
}
