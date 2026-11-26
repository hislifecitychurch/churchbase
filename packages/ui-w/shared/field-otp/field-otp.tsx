"use client"

import * as React from "react"
import { OTPField as FieldOTPPrimitive } from "@base-ui/react/otp-field"

import { cn } from "@packages/ui-w/lib/utils"

export function FieldOTP({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof FieldOTPPrimitive.Root> & {
  size?: "default" | "lg"
}): React.ReactElement {
  return (
    <FieldOTPPrimitive.Root
      className={cn("flex items-center gap-2 has-disabled:opacity-64", className)}
      data-size={size}
      data-slot="otp-field"
      {...props}
    />
  )
}
