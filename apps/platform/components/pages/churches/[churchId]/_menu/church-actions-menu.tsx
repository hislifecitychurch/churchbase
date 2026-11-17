"use client"

import { IconArchive, IconEditCircle } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"

export function ChurchActionsMenu(): React.ReactElement {
  return (
    <MenuPopup align="end" className="w-44">
      <MenuItem disabled>
        <IconEditCircle aria-hidden />
        Update profile
      </MenuItem>
      <MenuSeparator />
      <MenuItem disabled variant="destructive">
        <IconArchive aria-hidden />
        Archive church
      </MenuItem>
    </MenuPopup>
  )
}
