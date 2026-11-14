import { IconBuildingChurch } from "@tabler/icons-react"

import { StateEmpty } from "@/components/shared/_empty/state-empty"

export function ChurchesEmptyState(): React.ReactElement {
  return (
    <StateEmpty
      description="Churches will appear here once they have been added."
      icon={<IconBuildingChurch aria-hidden className="size-5" />}
      role="status"
      title="No churches yet"
    />
  )
}
