import { StateEmpty } from "@/components/shared/_empty/state-empty"

export function ChurchesEmptyState(): React.ReactElement {
  return (
    <StateEmpty
      description="Churches will appear here once they have been added."
      role="status"
      title="No churches yet"
    />
  )
}
