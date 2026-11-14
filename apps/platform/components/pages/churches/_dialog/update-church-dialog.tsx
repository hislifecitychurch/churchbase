"use client"

import type { Church } from "@/api/churches/list"

import { DialogDescription } from "@packages/ui-w/shared/dialog/dialog-description"
import { DialogHeader } from "@packages/ui-w/shared/dialog/dialog-header"
import { DialogPopup } from "@packages/ui-w/shared/dialog/dialog-popup"
import { DialogTitle } from "@packages/ui-w/shared/dialog/dialog-title"

import { UpdateChurchForm } from "@/components/pages/churches/_dialog/_form/update-church-form"

type UpdateChurchDialogProps = {
  church: Church
  onUpdated: () => void
}

export function UpdateChurchDialog({
  church,
  onUpdated,
}: UpdateChurchDialogProps): React.ReactElement {
  return (
    <DialogPopup>
      <DialogHeader>
        <DialogTitle>Update church</DialogTitle>
        <DialogDescription>Update this church’s name and directory details.</DialogDescription>
      </DialogHeader>
      <UpdateChurchForm church={church} onUpdated={onUpdated} />
    </DialogPopup>
  )
}
