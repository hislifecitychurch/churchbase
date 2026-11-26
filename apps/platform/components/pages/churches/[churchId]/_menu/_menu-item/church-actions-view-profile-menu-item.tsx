"use client"

import { IconEye } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"

type ChurchActionsViewProfileMenuItemProps = {
  onSelect: () => void
}

export function ChurchActionsViewProfileMenuItem({
  onSelect,
}: ChurchActionsViewProfileMenuItemProps): React.ReactElement {
  return (
    <MenuItem onClick={onSelect}>
      <IconEye aria-hidden />
      View profile
    </MenuItem>
  )
}
