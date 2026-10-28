"use client"

import * as React from "react"
import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog"

export function CommandDialogTrigger(
  props: CommandDialogPrimitive.Trigger.Props,
): React.ReactElement {
  return <CommandDialogPrimitive.Trigger data-slot="command-dialog-trigger" {...props} />
}
