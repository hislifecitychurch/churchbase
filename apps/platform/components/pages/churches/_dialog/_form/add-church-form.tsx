"use client"

import { useState } from "react"
import type * as React from "react"

import { useCreateChurch } from "@/hooks/api/churches/use-create-church"

import { Button } from "@packages/ui-w/shared/button/button"
import { DialogClose } from "@packages/ui-w/shared/dialog/dialog-close"
import { DialogFooter } from "@packages/ui-w/shared/dialog/dialog-footer"
import { DialogPanel } from "@packages/ui-w/shared/dialog/dialog-panel"

import { ChurchNameField } from "@/components/pages/churches/_dialog/_form/_field/church-name-field"
import { ChurchSlugField } from "@/components/pages/churches/_dialog/_form/_field/church-slug-field"

type AddChurchFormProps = {
  onCreated: () => void
}

export function AddChurchForm({ onCreated }: AddChurchFormProps): React.ReactElement {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const createChurch = useCreateChurch()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await createChurch.mutateAsync({ name: name.trim(), slug: slug.trim() })
      setName("")
      setSlug("")
      onCreated()
    } catch {
      setErrorMessage("We couldn't add this church. Check that the slug is unique and try again.")
    }
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <DialogPanel className="min-h-0 flex-1">
        <div className="flex flex-col gap-5">
          <ChurchNameField
            disabled={createChurch.isPending}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          <ChurchSlugField
            disabled={createChurch.isPending}
            onChange={(event) => setSlug(event.target.value)}
            value={slug}
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
