"use client"

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
      <span className="relative inline-flex">
        <DialogTrigger
          render={
            <Button
              size="lg"
              title={
                church.profile_complete ? undefined : "Required profile information is missing"
              }
              variant="outline"
            >
              View profile
              {!church.profile_complete && (
                <span className="sr-only">Church profile is incomplete</span>
              )}
            </Button>
          }
        />
        {!church.profile_complete && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 right-1 z-10 flex size-2"
          >
            <span className="absolute inline-flex size-full rounded-full bg-amber-500 opacity-75 motion-safe:animate-ping" />
            <span className="ring-background relative inline-flex size-2 rounded-full bg-amber-600 ring-2" />
          </span>
        )}
      </span>
      <ChurchProfileDialog church={church} />
    </Dialog>
  )
}
