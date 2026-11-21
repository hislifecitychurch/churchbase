"use client"

import { IconSettings } from "@tabler/icons-react"

import { Button } from "@packages/ui-w/shared/button/button"
import { Menu } from "@packages/ui-w/shared/menu/menu"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"

import { ChurchActionsMenu } from "@/components/pages/churches/[churchId]/_menu/church-actions-menu"

type ChurchActionsButtonProps = {
  onViewProfile: () => void
  onUpdateProfile: () => void
}

export function ChurchActionsButton({
  onViewProfile,
  onUpdateProfile,
}: ChurchActionsButtonProps): React.ReactElement {
  return (
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
      <ChurchActionsMenu onViewProfile={onViewProfile} onUpdateProfile={onUpdateProfile} />
    </Menu>
  )
}
