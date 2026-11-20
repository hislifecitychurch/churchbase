"use client"

import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"

import { ChurchActionsArchiveMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-archive-menu-item"
import { ChurchActionsUpdateProfileMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/church-actions-update-profile-menu-item"

export function ChurchActionsMenu(): React.ReactElement {
  return (
    <MenuPopup align="end" className="w-44">
      <ChurchActionsUpdateProfileMenuItem />
      <MenuSeparator />
      <ChurchActionsArchiveMenuItem />
    </MenuPopup>
  )
}
