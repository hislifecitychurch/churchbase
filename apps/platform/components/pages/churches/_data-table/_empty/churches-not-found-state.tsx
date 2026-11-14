import { IconSearch } from "@tabler/icons-react"

import { Button } from "@packages/ui-w/shared/button/button"

import { StateEmpty } from "@/components/shared/_empty/state-empty"

export function ChurchesNotFoundState({ onClear }: { onClear: () => void }): React.ReactElement {
  return (
    <StateEmpty
      actions={
        <Button onClick={onClear} type="button" variant="outline">
          Clear search
        </Button>
      }
      description="Try a different search or clear it to see all churches."
      icon={<IconSearch aria-hidden className="size-5" />}
      role="status"
      title="No churches found"
    />
  )
}
