"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getChurchById } from "@/api/churches/get-by-id"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { getProfileCompletenessToastAction } from "@/lib/churches/get-profile-completeness-toast-action"

import { toastManager } from "@packages/ui-w/providers/toast-provider"

type ProfileDialogRequest = { churchId: string; mode: "view" | "update" } | null

export function useGetById(churchId: string) {
  const churchQuery = useQuery({
    queryKey: ["platform", "churches", churchId],
    queryFn: () => getChurchById(churchId),
    enabled: Boolean(churchId),
    retry: false,
  })
  const currentUser = useCurrentUser()
  const canUpdateProfile = currentUser.data?.global_roles === "admin"
  const [profileDialogRequest, setProfileDialogRequest] = useState<ProfileDialogRequest>(null)
  const profileChurchId = churchQuery.data?.id
  const isProfileComplete = churchQuery.data?.profile_complete

  useEffect(() => {
    setProfileDialogRequest(null)
  }, [churchId])

  useEffect(() => {
    if (!profileChurchId || isProfileComplete === undefined) return

    const toastId = `church-profile-incomplete-${profileChurchId}`
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
          setProfileDialogRequest({ churchId: profileChurchId, mode: action.mode })
        },
      },
    })

    return () => toastManager.close(toastId)
  }, [canUpdateProfile, isProfileComplete, profileChurchId])

  return { ...churchQuery, profileDialogRequest, setProfileDialogRequest }
}
