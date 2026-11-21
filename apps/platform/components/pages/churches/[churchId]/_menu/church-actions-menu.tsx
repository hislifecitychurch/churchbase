"use client"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"

import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"

import { ChurchActionsArchiveMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-archive-menu-item"
import { ChurchActionsUpdateProfileMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-update-profile-menu-item"
import { ChurchActionsViewProfileMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-view-profile-menu-item"

type ChurchActionsMenuProps = {
  onViewProfile: () => void
  onUpdateProfile: () => void
}

export function ChurchActionsMenu({
  onViewProfile,
  onUpdateProfile,
}: ChurchActionsMenuProps): React.ReactElement {
  const currentUser = useCurrentUser()
  const canUpdateProfile = currentUser.data?.global_roles === "admin"

  return (
    <MenuPopup align="end" className="w-44">
      <ChurchActionsViewProfileMenuItem onSelect={onViewProfile} />
      <MenuSeparator />
      {canUpdateProfile ? (
        <>
          <ChurchActionsUpdateProfileMenuItem onSelect={onUpdateProfile} />
          <MenuSeparator />
        </>
      ) : null}
      <ChurchActionsArchiveMenuItem />
    </MenuPopup>
  )
}
