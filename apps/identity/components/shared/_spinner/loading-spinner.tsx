import type { JSX } from "react"

import { SpinnerFlicker01 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-01"

export function LoadingSpinner(): JSX.Element {
  return (
    <main aria-busy="true" className="flex min-h-svh items-center justify-center">
      <SpinnerFlicker01 aria-label="Loading" className="size-6" />
    </main>
  )
}
