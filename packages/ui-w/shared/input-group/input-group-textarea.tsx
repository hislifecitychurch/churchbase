"use client"

import type * as React from "react"

import { Textarea, type TextareaProps } from "@packages/ui-w/shared/textarea/textarea"

export function InputGroupTextarea({ className, ...props }: TextareaProps): React.ReactElement {
  return <Textarea className={className} unstyled {...props} />
}
