"use client"

import { IconArchive } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"

export function ArchiveChurchMenuItem(): React.ReactElement {
  return (
    <MenuItem disabled variant="destructive">
      <IconArchive aria-hidden />
      Archive church
    </MenuItem>
  )
}
