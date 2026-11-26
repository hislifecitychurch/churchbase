"use client"

import { DialogDescription } from "@packages/ui-w/shared/dialog/dialog-description"
import { DialogHeader } from "@packages/ui-w/shared/dialog/dialog-header"
import { DialogPopup } from "@packages/ui-w/shared/dialog/dialog-popup"
import { DialogTitle } from "@packages/ui-w/shared/dialog/dialog-title"

import { AddChurchForm } from "@/components/pages/churches/_dialog/_form/add-church-form"

type AddChurchDialogProps = {
  onCreated: () => void
}

export function AddChurchDialog({ onCreated }: AddChurchDialogProps): React.ReactElement {
  return (
    <DialogPopup>
      <DialogHeader>
        <DialogTitle>Add church</DialogTitle>
        <DialogDescription>
          Add a church to the directory. No church memberships are created automatically.
        </DialogDescription>
      </DialogHeader>
      <AddChurchForm onCreated={onCreated} />
    </DialogPopup>
  )
}
