"use client"

import { useState } from "react"
import type * as React from "react"

import { useCreate } from "@/hooks/api/churches/use-create"
import { slugifyChurchName } from "@/lib/formatter/slug/church-name"

import { Button } from "@packages/ui-w/shared/button/button"
import { DialogClose } from "@packages/ui-w/shared/dialog/dialog-close"
import { DialogFooter } from "@packages/ui-w/shared/dialog/dialog-footer"
import { DialogPanel } from "@packages/ui-w/shared/dialog/dialog-panel"

import { AddChurchNameField } from "@/components/pages/churches/_dialog/_form/_field/add-church-name-field"
import { AddChurchSlugField } from "@/components/pages/churches/_dialog/_form/_field/add-church-slug-field"

type AddChurchFormProps = {
  onCreated: () => void
}

export function AddChurchForm({ onCreated }: AddChurchFormProps): React.ReactElement {
  const [name, setName] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const createChurch = useCreate()
  const slug = slugifyChurchName(name)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    if (!slug) {
      setErrorMessage("Enter a church name with at least one letter or number.")
      return
    }

    try {
      await createChurch.mutateAsync({ name: name.trim(), slug })
      setName("")
      onCreated()
    } catch {
      setErrorMessage("We couldn't add this church. Check the details and try again.")
    }
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <DialogPanel className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <AddChurchNameField
            disabled={createChurch.isPending}
            onChange={(event) => {
              setName(event.target.value)
              setErrorMessage(null)
            }}
            value={name}
          />
          <AddChurchSlugField disabled={createChurch.isPending} value={slug} />
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
