"use client"

import * as React from "react"
import { Toast } from "@base-ui/react/toast"

import { cn } from "@packages/ui-w/lib/utils"
import { upsertReplayClassName } from "@packages/ui-w/helpers/toast/upsert-replay-class-name"

import { buttonVariants } from "@packages/ui-w/shared/variants"
import { ToastIcon } from "@packages/ui-w/shared/toast/toast-icon"

export function ToastsAnchored({
  portalProps,
}: {
  portalProps?: React.ComponentProps<typeof Toast.Portal>
}): React.ReactElement {
  const { toasts } = Toast.useToastManager()

  return (
    <Toast.Portal data-slot="toast-portal-anchored" {...portalProps}>
      <Toast.Viewport className="outline-none" data-slot="toast-viewport-anchored">
        {toasts.map((toast) => {
          const tooltipStyle = (toast.data as { tooltipStyle?: boolean })?.tooltipStyle ?? false
          const positionerProps = toast.positionerProps

          if (!positionerProps?.anchor) {
            return null
          }

          return (
            <Toast.Positioner
              key={toast.id}
              className="z-50 max-w-[min(--spacing(64),var(--available-width))]"
              data-slot="toast-positioner"
              sideOffset={positionerProps.sideOffset ?? 4}
              toast={toast}
            >
              <Toast.Root
                className={cn(
                  "bg-popover text-popover-foreground relative border text-xs text-balance transition-[scale,opacity] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0",
                  "rounded-xl before:rounded-xl",
                  upsertReplayClassName(toast),
                )}
                data-slot="toast-popup"
                toast={toast}
              >
                {tooltipStyle ? (
                  <Toast.Content className="pointer-events-auto px-2 py-1">
                    <Toast.Title data-slot="toast-title" />
                  </Toast.Content>
                ) : (
                  <Toast.Content className="pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm">
                    <div className="flex gap-2">
                      {toast.type && (
                        <div
                          className="[&_svg]:pointer-events-none [&_svg]:shrink-0 [&>svg]:h-lh [&>svg]:w-4"
                          data-slot="toast-icon"
                        >
                          <ToastIcon type={toast.type} />
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5">
                        <Toast.Title className="font-medium" data-slot="toast-title" />
                        <Toast.Description
                          className="text-muted-foreground"
                          data-slot="toast-description"
                        />
                      </div>
                    </div>
                    {toast.actionProps && (
                      <Toast.Action
                        className={buttonVariants({ size: "xs" })}
                        data-slot="toast-action"
                      >
                        {toast.actionProps.children}
                      </Toast.Action>
                    )}
                  </Toast.Content>
                )}
              </Toast.Root>
            </Toast.Positioner>
          )
        })}
      </Toast.Viewport>
    </Toast.Portal>
  )
}
