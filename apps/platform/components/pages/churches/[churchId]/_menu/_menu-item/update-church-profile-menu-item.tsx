"use client"

import { IconEditCircle } from "@tabler/icons-react"

import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"

export function UpdateChurchProfileMenuItem(): React.ReactElement {
  return (
    <MenuItem disabled>
      <IconEditCircle aria-hidden />
      Update profile
    </MenuItem>
  )
}
