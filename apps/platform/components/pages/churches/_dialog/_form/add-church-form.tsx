"use client"

import { useState } from "react"
import type * as React from "react"

import { useCreateChurch } from "@/hooks/api/churches/use-create-church"
import { slugifyChurchName } from "@/lib/churches/slugify"

import { Button } from "@packages/ui-w/shared/button/button"
import { DialogClose } from "@packages/ui-w/shared/dialog/dialog-close"
import { DialogFooter } from "@packages/ui-w/shared/dialog/dialog-footer"
import { DialogPanel } from "@packages/ui-w/shared/dialog/dialog-panel"

import { ChurchMetadataFields } from "@/components/pages/churches/_dialog/_form/_field/church-metadata-fields"
import type { ChurchMetadataValues } from "@/components/pages/churches/_dialog/_form/_field/church-metadata-fields"
import { ChurchNameField } from "@/components/pages/churches/_dialog/_form/_field/church-name-field"
import { ChurchSlugField } from "@/components/pages/churches/_dialog/_form/_field/church-slug-field"

const emptyChurchMetadata: ChurchMetadataValues = { timezone: "", website: "", bio: "" }

type AddChurchFormProps = {
  onCreated: () => void
}

export function AddChurchForm({ onCreated }: AddChurchFormProps): React.ReactElement {
  const [name, setName] = useState("")
  const [metadata, setMetadata] = useState(emptyChurchMetadata)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const createChurch = useCreateChurch()
  const slug = slugifyChurchName(name)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    if (!slug) {
      setErrorMessage("Enter a church name with at least one letter or number.")
      return
    }

    try {
      await createChurch.mutateAsync({ name: name.trim(), slug, ...metadata })
      setName("")
      setMetadata(emptyChurchMetadata)
      onCreated()
    } catch {
      setErrorMessage("We couldn't add this church. Check the details and try again.")
    }
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <DialogPanel className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <ChurchNameField
            disabled={createChurch.isPending}
            onChange={(event) => {
              setName(event.target.value)
              setErrorMessage(null)
            }}
            value={name}
          />
          <ChurchSlugField disabled={createChurch.isPending} value={slug} />
          <ChurchMetadataFields
            disabled={createChurch.isPending}
            onChange={(field, value) => {
              setMetadata((current) => ({ ...current, [field]: value }))
              setErrorMessage(null)
            }}
            value={metadata}
          />
        </div>
        {errorMessage ? (
          <p aria-live="polite" className="text-destructive mt-4 text-sm" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </DialogPanel>
      <DialogFooter>
        <DialogClose
          render={
            <Button disabled={createChurch.isPending} size="lg" type="button" variant="outline">
              Cancel
            </Button>
          }
        />
        <Button
          aria-busy={createChurch.isPending}
          disabled={createChurch.isPending}
          size="lg"
          type="submit"
        >
          {createChurch.isPending ? "Adding..." : "Add church"}
        </Button>
      </DialogFooter>
    </form>
  )
}
