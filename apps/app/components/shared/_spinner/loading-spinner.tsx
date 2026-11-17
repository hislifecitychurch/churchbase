import type { JSX } from "react"

import { SpinnerFlicker01 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-01"

export function LoadingSpinner(): JSX.Element {
  return (
    <div aria-busy="true" className="flex flex-1 items-center justify-center">
      <SpinnerFlicker01 aria-label="Loading" className="size-6" />
    </div>
  )
}
