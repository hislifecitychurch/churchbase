"use client"

import { TOAST_ICONS } from "@packages/ui-w/lib/constants"
import { SpinnerFlicker01 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-01"

export function ToastIcon({ type }: { type?: string | null }): React.ReactElement | null {
  if (type === "loading") return <SpinnerFlicker01 />

  const Icon = type ? TOAST_ICONS[type as keyof typeof TOAST_ICONS] : null
  return Icon ? (
    <Icon className="in-data-[type=error]:text-destructive-text in-data-[type=info]:text-info-text in-data-[type=success]:text-success-text in-data-[type=warning]:text-warning-text" />
  ) : null
}
