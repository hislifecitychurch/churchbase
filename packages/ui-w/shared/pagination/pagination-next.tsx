"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { PaginationLink } from "@packages/ui-w/shared/pagination/pagination-link"

export function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): React.ReactElement {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <span className="max-sm:hidden">Next</span>
      <IconChevronRight className="sm:-me-1" />
    </PaginationLink>
  )
}
