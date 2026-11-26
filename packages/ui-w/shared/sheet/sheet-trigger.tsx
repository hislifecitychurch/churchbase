"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

export function SheetTrigger(props: SheetPrimitive.Trigger.Props): React.ReactElement {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}
