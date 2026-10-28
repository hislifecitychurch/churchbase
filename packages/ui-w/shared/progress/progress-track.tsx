"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@packages/ui-w/lib/utils"

export function ProgressTrack({
  className,
  ...props
}: ProgressPrimitive.Track.Props): React.ReactElement {
  return (
    <ProgressPrimitive.Track
      className={cn("bg-input block h-1.5 w-full overflow-hidden rounded-full", className)}
      data-slot="progress-track"
      {...props}
    />
  )
}
