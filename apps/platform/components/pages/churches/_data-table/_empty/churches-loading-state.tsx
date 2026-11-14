import { StateEmpty } from "@/components/shared/_empty/state-empty"

export function ChurchesLoadingState(): React.ReactElement {
  return (
    <StateEmpty
      description="Getting the church directory ready."
      role="status"
      title="Loading churches"
    />
  )
}
