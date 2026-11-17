"use client"

import { IconArchive, IconEditCircle, IconEye } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"

export function ChurchActionsMenu(): React.ReactElement {
  // shortcut: keep menu actions disabled until their workflows are implemented.
  return (
    <MenuPopup align="end" className="w-44">
      <MenuItem disabled>
        <IconEye aria-hidden />
        View profile
      </MenuItem>
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
