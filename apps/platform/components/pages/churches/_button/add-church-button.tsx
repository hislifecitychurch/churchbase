"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"

import { Button } from "@packages/ui-w/shared/button/button"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"
import { DialogTrigger } from "@packages/ui-w/shared/dialog/dialog-trigger"

import { AddChurchDialog } from "@/components/pages/churches/_dialog/add-church-dialog"

export function AddChurchButton(): React.ReactElement | null {
  const currentUser = useCurrentUser()
  const [open, setOpen] = useState(false)

  if (currentUser.data?.global_roles !== "admin") {
    return null
  }

  return (
    <Dialog onOpenChange={(nextOpen) => setOpen(nextOpen)} open={open}>
      <DialogTrigger
        render={
          <Button size="lg" type="button">
            <IconPlus aria-hidden className="size-4" />
            Add church
          </Button>
        }
      />
      <AddChurchDialog onCreated={() => setOpen(false)} />
    </Dialog>
  )
}
