import { IconAlertTriangle } from "@tabler/icons-react"

import { Button } from "@packages/ui-w/shared/button/button"

import { StateEmpty } from "@/components/shared/_empty/state-empty"

export function ChurchesErrorState({ onRetry }: { onRetry: () => void }): React.ReactElement {
  return (
    <StateEmpty
      actions={
        <Button onClick={onRetry} type="button" variant="outline">
          Try again
        </Button>
      }
      description="The church directory couldn't be loaded. Please try again."
      icon={<IconAlertTriangle aria-hidden className="size-5" />}
      role="alert"
      title="Could not load churches"
    />
  )
}
