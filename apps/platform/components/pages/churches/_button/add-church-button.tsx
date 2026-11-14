import { IconPlus } from "@tabler/icons-react"

import { Button } from "@packages/ui-w/shared/button/button"

export function AddChurchButton(): React.ReactElement {
  return (
    <Button size="lg" type="button">
      <IconPlus aria-hidden className="size-4" />
      Create church
    </Button>
  )
}
