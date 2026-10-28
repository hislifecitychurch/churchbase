import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export type TableVariant = "default" | "card"

export function Table({
  className,
  containerClassName,
  variant = "default",
  ...props
}: React.ComponentProps<"table"> & {
  containerClassName?: string
  variant?: TableVariant
}): React.ReactElement {
  return (
    <div
      className={cn(
        "relative w-full min-w-0 overflow-x-auto overflow-y-visible",
        containerClassName,
      )}
      data-slot="table-container"
      data-variant={variant}
    >
      <table
        className={cn(
          "w-full caption-bottom text-sm in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0",
          className,
        )}
        data-slot="table"
        {...props}
      />
    </div>
  )
}
