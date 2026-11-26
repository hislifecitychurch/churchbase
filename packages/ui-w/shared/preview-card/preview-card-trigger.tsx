"use client"

import * as React from "react"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"

export function PreviewCardTrigger({
  delay = 0,
  closeDelay = 80,
  ...props
}: PreviewCardPrimitive.Trigger.Props): React.ReactElement {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="preview-card-trigger"
      delay={delay}
      closeDelay={closeDelay}
      {...props}
    />
  )
}
