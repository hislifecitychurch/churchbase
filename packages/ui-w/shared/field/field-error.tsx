"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { cn } from "@packages/ui-w/lib/utils"

export function FieldError({
  forceMount = false,
  className,
  children,
  ...props
}: FieldPrimitive.Error.Props & {
  forceMount?: boolean
}): React.ReactElement {
  if (forceMount) {
    return (
      <div
        className={cn("text-xs text-red-700 dark:text-red-400", className)}
        data-slot="field-error"
        id={props.id}
        role={props.role}
        aria-describedby={props["aria-describedby"]}
        aria-live={props["aria-live"]}
      >
        {children}
      </div>
    )
  }

  return (
    <FieldPrimitive.Error
      className={cn("text-xs text-red-700 dark:text-red-400", className)}
      data-slot="field-error"
      {...(children ? { children } : {})}
      {...props}
    />
  )
}
