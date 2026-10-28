"use client"

import * as React from "react"
import { IconInfoCircle } from "@tabler/icons-react"

import { Tooltip } from "@packages/ui-w/shared/tooltip/tooltip"
import { TooltipPopup } from "@packages/ui-w/shared/tooltip/tooltip-popup"
import { TooltipTrigger } from "@packages/ui-w/shared/tooltip/tooltip-trigger"

export function FieldInfoTooltip({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            aria-label="More information"
            className="text-muted-foreground inline-flex size-4 cursor-help items-center justify-center"
            role="img"
            tabIndex={0}
          >
            <IconInfoCircle aria-hidden className="size-4" />
          </span>
        }
      />
      <TooltipPopup side="top" align="center">
        {children}
      </TooltipPopup>
    </Tooltip>
  )
}
