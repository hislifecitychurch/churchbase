"use client"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"

export function ChurchActionsMenu(): React.ReactElement {
  // shortcut: keep menu actions disabled until their workflows are implemented.
  return (
    <MenuPopup align="end" className="w-44">
      <MenuItem disabled>View profile</MenuItem>
      <MenuItem disabled>Update profile</MenuItem>
      <MenuSeparator />
      <MenuItem disabled variant="destructive">
        Archive church
      </MenuItem>
    </MenuPopup>
  )
}
