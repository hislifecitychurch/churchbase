"use client"

import * as React from "react"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

export function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props): React.ReactElement {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}
