"use client"

import { IconEye } from "@tabler/icons-react"

import type { Church } from "@/api/churches/get-all"

import { Button } from "@packages/ui-w/shared/button/button"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"
import { DialogTrigger } from "@packages/ui-w/shared/dialog/dialog-trigger"

import { ChurchProfileDialog } from "@/components/pages/churches/[churchId]/_dialog/church-profile-dialog"

type ViewProfileButtonProps = {
  church: Church
}

export function ViewProfileButton({ church }: ViewProfileButtonProps): React.ReactElement {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg" variant="outline">
            <IconEye aria-hidden className="size-4" />
            View profile
          </Button>
        }
      />
      <ChurchProfileDialog church={church} />
    </Dialog>
  )
}
