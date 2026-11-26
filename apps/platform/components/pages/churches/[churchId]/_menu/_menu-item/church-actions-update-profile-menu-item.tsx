"use client"

import { IconEditCircle } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"

type ChurchActionsUpdateProfileMenuItemProps = {
  onSelect: () => void
}

export function ChurchActionsUpdateProfileMenuItem({
  onSelect,
}: ChurchActionsUpdateProfileMenuItemProps): React.ReactElement {
  return (
    <MenuItem onClick={onSelect}>
      <IconEditCircle aria-hidden />
      Update profile
    </MenuItem>
  )
}
