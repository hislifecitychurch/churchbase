"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { AutocompleteInput } from "@packages/ui-w/shared/autocomplete/autocomplete-input"

export function CommandInput({
  className,
  placeholder = undefined,
  ...props
}: React.ComponentProps<typeof AutocompleteInput>): React.ReactElement {
  return (
    <div className="px-2.5 py-1.5">
      <AutocompleteInput
        autoFocus
        className={cn(
          "border-transparent! bg-transparent! before:hidden has-focus-visible:ring-0",
          className,
        )}
        placeholder={placeholder}
        size="lg"
        startAddon={<IconSearch />}
        {...props}
      />
    </div>
  )
}
