import type * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"
import { Empty } from "@packages/ui-w/shared/empty/empty"
import { EmptyContent } from "@packages/ui-w/shared/empty/empty-content"
import { EmptyDescription } from "@packages/ui-w/shared/empty/empty-description"
import { EmptyHeader } from "@packages/ui-w/shared/empty/empty-header"
import { EmptyTitle } from "@packages/ui-w/shared/empty/empty-title"

export function StateEmpty({
  actions,
  className,
  description,
  role,
  title,
}: {
  actions?: React.ReactNode
  className?: string
  description: React.ReactNode
  role?: "alert" | "status"
  title: React.ReactNode
}): React.ReactElement {
  return (
    <Empty className={cn("min-h-48 py-8 md:py-10", className)} role={role}>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actions ? <EmptyContent>{actions}</EmptyContent> : null}
    </Empty>
  )
}
