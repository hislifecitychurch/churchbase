import * as React from "react"
import { type Column } from "@tanstack/react-table"
import { IconArrowsUpDown, IconChevronDown, IconChevronUp } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Button } from "@packages/ui-w/shared/button/button"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort()
  const sorting = column.getIsSorted()

  if (!canSort) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        aria-label={`${title}: sort ${sorting === "asc" ? "descending" : "ascending"}`}
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(sorting === "asc")}
        size="sm"
        variant="ghost"
      >
        <span>{title}</span>
        {sorting === "desc" ? (
          <IconChevronDown className="size-4" />
        ) : sorting === "asc" ? (
          <IconChevronUp className="size-4" />
        ) : (
          <IconArrowsUpDown className="size-4" />
        )}
      </Button>
    </div>
  )
}
