"use client"

import * as React from "react"
import { Separator as OTPFieldSeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@packages/ui-w/lib/utils"

import { Separator } from "@packages/ui-w/shared/separator/separator"

export function FieldOTPSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>): React.ReactElement {
  return (
    <OTPFieldSeparatorPrimitive
      render={
        <Separator
          className={cn(
            "bg-input rounded-full data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-3",
            className,
          )}
          orientation="horizontal"
          {...props}
        />
      }
    />
  )
}
