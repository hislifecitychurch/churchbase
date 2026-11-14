import { SpinnerFlicker01 } from "@packages/ui-w/shared/spinner-variant/spinner-flicker-01"

import { StateEmpty } from "@/components/shared/_empty/state-empty"

export function ChurchesLoadingState(): React.ReactElement {
  return (
    <StateEmpty
      description="Getting the church directory ready."
      icon={<SpinnerFlicker01 aria-hidden className="size-5" />}
      role="status"
      title="Loading churches"
    />
  )
}
