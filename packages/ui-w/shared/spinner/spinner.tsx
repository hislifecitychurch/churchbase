import * as React from "react"

import { IconLoader2 } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof IconLoader2>): React.ReactElement {
  return (
    <IconLoader2
      aria-label="Loading"
      className={cn("animate-spin", className)}
      role="status"
      {...props}
    />
  )
}
