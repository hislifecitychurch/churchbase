"use client"

import type * as React from "react"

import { Input, type InputProps } from "@packages/ui-w/shared/input/input"

export function InputGroupInput({ className, ...props }: InputProps): React.ReactElement {
  return <Input className={className} unstyled {...props} />
}
