"use client"

import { useState } from "react"

import type { Church } from "@/api/churches/get-all"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"

import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"

import { UpdateChurchProfileDialog } from "@/components/pages/churches/[churchId]/_dialog/update-church-profile-dialog"
import { ChurchActionsArchiveMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-archive-menu-item"
import { ChurchActionsUpdateProfileMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-update-profile-menu-item"

type ChurchActionsMenuProps = {
  church: Church
}

export function ChurchActionsMenu({ church }: ChurchActionsMenuProps): React.ReactElement {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const currentUser = useCurrentUser()
  const canUpdateProfile = currentUser.data?.global_roles === "admin"

  return (
    <>
      <MenuPopup align="end" className="w-44">
        {canUpdateProfile ? (
          <>
            <ChurchActionsUpdateProfileMenuItem onSelect={() => setIsUpdatingProfile(true)} />
            <MenuSeparator />
          </>
        ) : null}
        <ChurchActionsArchiveMenuItem />
      </MenuPopup>
      <Dialog onOpenChange={(open) => setIsUpdatingProfile(open)} open={isUpdatingProfile}>
        {isUpdatingProfile ? (
          <UpdateChurchProfileDialog
            church={church}
            onUpdated={() => setIsUpdatingProfile(false)}
          />
        ) : null}
      </Dialog>
    </>
  )
}
