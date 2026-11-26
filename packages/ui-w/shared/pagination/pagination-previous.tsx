"use client"

import * as React from "react"
import { IconChevronLeft } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { PaginationLink } from "@packages/ui-w/shared/pagination/pagination-link"

export function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): React.ReactElement {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <IconChevronLeft className="sm:-ms-1" />
      <span className="max-sm:hidden">Previous</span>
    </PaginationLink>
  )
}
