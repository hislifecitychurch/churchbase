"use client"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

export function AlertDialogClose(props: AlertDialogPrimitive.Close.Props): React.ReactElement {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
}
