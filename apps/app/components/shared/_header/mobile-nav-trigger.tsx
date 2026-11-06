"use client"

import { IconMenu2 } from "@tabler/icons-react"

import { useSidebar } from "@packages/ui-w/hooks/use-sidebar"
import { Button } from "@packages/ui-w/shared/button/button"

export function MobileNavTrigger(): React.ReactElement {
  const { setOpenMobile } = useSidebar()

  return (
    <Button
      aria-label="Open navigation"
      onClick={() => setOpenMobile(true)}
      size="icon-lg"
      variant="ghost"
    >
      <IconMenu2 aria-hidden />
    </Button>
  )
}
