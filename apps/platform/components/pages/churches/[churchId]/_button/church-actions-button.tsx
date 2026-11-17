"use client"

import { useState } from "react"
import { IconSettings } from "@tabler/icons-react"

import type { Church } from "@/api/churches/get-all"

import { Button } from "@packages/ui-w/shared/button/button"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"
import { Menu } from "@packages/ui-w/shared/menu/menu"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"

import { ChurchActionsMenu } from "@/components/pages/churches/[churchId]/_menu/church-actions-menu"
import { ChurchProfileDialog } from "@/components/pages/churches/[churchId]/_dialog/church-profile-dialog"

type ChurchActionsButtonProps = {
  church: Church
}

export function ChurchActionsButton({ church }: ChurchActionsButtonProps): React.ReactElement {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <>
      <Menu>
        <MenuTrigger
          render={
            <Button
              aria-label="Church actions"
              className="data-popup-open:bg-muted"
              size="icon-lg"
              variant="outline"
            >
              <IconSettings aria-hidden className="size-4" />
            </Button>
          }
        />
        <ChurchActionsMenu onViewProfile={() => setProfileOpen(true)} />
      </Menu>
      <Dialog onOpenChange={(open) => setProfileOpen(open)} open={profileOpen}>
        <ChurchProfileDialog church={church} />
      </Dialog>
    </>
  )
}
