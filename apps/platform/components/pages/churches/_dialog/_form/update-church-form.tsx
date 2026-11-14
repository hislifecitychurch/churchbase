"use client"

import { useState } from "react"
import type * as React from "react"

import { useUpdateChurch } from "@/hooks/api/churches/use-update-church"
import type { Church } from "@/api/churches/list"

import { Button } from "@packages/ui-w/shared/button/button"
import { DialogClose } from "@packages/ui-w/shared/dialog/dialog-close"
import { DialogFooter } from "@packages/ui-w/shared/dialog/dialog-footer"
import { DialogPanel } from "@packages/ui-w/shared/dialog/dialog-panel"

import { UpdateChurchFields } from "@/components/pages/churches/_dialog/_form/_field/update-church-fields"
import type { UpdateChurchValues } from "@/components/pages/churches/_dialog/_form/_field/update-church-fields"

type UpdateChurchFormProps = {
  church: Church
  onUpdated: () => void
}

export function UpdateChurchForm({ church, onUpdated }: UpdateChurchFormProps): React.ReactElement {
  const [values, setValues] = useState<UpdateChurchValues>({
    name: church.name,
    timezone: church.timezone ?? "",
    website: church.website ?? "",
    bio: church.bio ?? "",
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const updateChurch = useUpdateChurch()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await updateChurch.mutateAsync({
        churchID: church.id,
        input: { ...values, name: values.name.trim() },
      })
      onUpdated()
    } catch {
      setErrorMessage("We couldn't update this church. Check the details and try again.")
    }
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <DialogPanel className="min-h-0 flex-1 overflow-y-auto">
        <UpdateChurchFields
          disabled={updateChurch.isPending}
          onChange={(field, value) => {
            setValues((current) => ({ ...current, [field]: value }))
            setErrorMessage(null)
          }}
          slug={church.slug}
          value={values}
        />
        {errorMessage ? (
          <p aria-live="polite" className="text-destructive mt-4 text-sm" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </DialogPanel>
      <DialogFooter>
        <DialogClose
          render={
            <Button disabled={updateChurch.isPending} size="lg" type="button" variant="outline">
              Cancel
            </Button>
          }
        />
        <Button
          aria-busy={updateChurch.isPending}
          disabled={updateChurch.isPending}
          size="lg"
          type="submit"
        >
          {updateChurch.isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
