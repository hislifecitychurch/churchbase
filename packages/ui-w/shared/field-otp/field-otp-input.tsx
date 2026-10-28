"use client"

import * as React from "react"
import { OTPField as FieldOTPPrimitive } from "@base-ui/react/otp-field"

import { cn } from "@repo/ui-w/lib/utils"

export function FieldOTPInput({
  className,
  ...props
}: React.ComponentProps<typeof FieldOTPPrimitive.Input>): React.ReactElement {
  return (
    <FieldOTPPrimitive.Input
      className={cn(
        "border-input bg-background text-foreground ring-ring/24 focus-visible:border-foreground focus-visible:ring-foreground/24 aria-invalid:border-destructive/36 aria-invalid:focus-visible:border-destructive/64 aria-invalid:focus-visible:ring-destructive/16 dark:bg-input/32 dark:aria-invalid:focus-visible:ring-destructive/24 relative size-9 min-w-0 rounded-xl border text-center text-base leading-9 outline-none not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-xl focus-visible:z-10 focus-visible:ring-[3px] in-[[data-slot=otp-field][data-size=lg]]:size-10 in-[[data-slot=otp-field][data-size=lg]]:text-lg in-[[data-slot=otp-field][data-size=lg]]:leading-10 sm:size-8 sm:text-sm sm:leading-8 sm:in-[[data-slot=otp-field][data-size=lg]]:size-9 sm:in-[[data-slot=otp-field][data-size=lg]]:text-base sm:in-[[data-slot=otp-field][data-size=lg]]:leading-9",
        className,
      )}
      data-slot="otp-field-input"
      spellCheck={false}
      {...props}
    />
  )
}
