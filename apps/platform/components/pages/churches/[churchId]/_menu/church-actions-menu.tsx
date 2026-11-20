"use client"

import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"

import { ArchiveChurchMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/archive-church-menu-item"
import { UpdateChurchProfileMenuItem } from "@/components/pages/churches/[churchId]/_menu/_menu-item/update-church-profile-menu-item"

export function ChurchActionsMenu(): React.ReactElement {
  return (
    <MenuPopup align="end" className="w-44">
      <UpdateChurchProfileMenuItem />
      <MenuSeparator />
      <ArchiveChurchMenuItem />
    </MenuPopup>
  )
}
