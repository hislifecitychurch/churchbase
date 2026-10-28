import * as React from "react"

import { type VariantProps } from "class-variance-authority"

import { cn } from "@packages/ui-w/lib/utils"
import { emptyMediaVariants } from "@packages/ui-w/shared/variants"

export function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>): React.ReactElement {
  return (
    <div className={cn("relative mb-4", className)} data-slot="empty-media" data-variant={variant}>
      {variant === "icon" && (
        <>
          <div
            aria-hidden="true"
            className={cn(
              emptyMediaVariants({ className, variant }),
              "pointer-events-none absolute bottom-px origin-bottom-left -translate-x-0.5 scale-84 -rotate-10",
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              emptyMediaVariants({ className, variant }),
              "pointer-events-none absolute bottom-px origin-bottom-right translate-x-0.5 scale-84 rotate-10",
            )}
          />
        </>
      )}
      <div className={cn(emptyMediaVariants({ variant }))} {...props} />
    </div>
  )
}
