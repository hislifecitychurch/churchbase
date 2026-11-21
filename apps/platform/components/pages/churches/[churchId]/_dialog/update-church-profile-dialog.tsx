"use client"

import type { Church } from "@/api/churches/types"

import { DialogDescription } from "@packages/ui-w/shared/dialog/dialog-description"
import { DialogHeader } from "@packages/ui-w/shared/dialog/dialog-header"
import { DialogPopup } from "@packages/ui-w/shared/dialog/dialog-popup"
import { DialogTitle } from "@packages/ui-w/shared/dialog/dialog-title"

import { UpdateChurchProfileForm } from "@/components/pages/churches/[churchId]/_dialog/_form/update-church-profile-form"

type UpdateChurchProfileDialogProps = {
  church: Church
  onUpdated: () => void
}

export function UpdateChurchProfileDialog({
  church,
  onUpdated,
}: UpdateChurchProfileDialogProps): React.ReactElement {
  return (
    <DialogPopup className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Update church profile</DialogTitle>
        <DialogDescription>Update the profile information for {church.name}.</DialogDescription>
      </DialogHeader>
      <UpdateChurchProfileForm church={church} onUpdated={onUpdated} />
    </DialogPopup>
  )
}
