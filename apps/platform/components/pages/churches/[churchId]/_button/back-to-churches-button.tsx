import type * as React from "react"

import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

import { Button } from "@packages/ui-w/shared/button/button"

export function BackToChurchesButton(): React.ReactElement {
  return (
    <Button
      className="text-muted-foreground self-start text-sm font-normal"
      render={<Link href="/churches" />}
      variant="ghost"
    >
      <IconArrowLeft aria-hidden />
      Back to churches
    </Button>
  )
}
