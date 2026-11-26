"use client"

import type * as React from "react"

import type { Church } from "@/api/churches/_types"

import { DialogDescription } from "@packages/ui-w/shared/dialog/dialog-description"
import { DialogHeader } from "@packages/ui-w/shared/dialog/dialog-header"
import { DialogPanel } from "@packages/ui-w/shared/dialog/dialog-panel"
import { DialogPopup } from "@packages/ui-w/shared/dialog/dialog-popup"
import { DialogTitle } from "@packages/ui-w/shared/dialog/dialog-title"

type ViewChurchProfileDialogProps = {
  church: Church
}

function ChurchProfileField({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}): React.ReactElement {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  )
}

export function ViewChurchProfileDialog({
  church,
}: ViewChurchProfileDialogProps): React.ReactElement {
  return (
    <DialogPopup className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{church.name}</DialogTitle>
        <DialogDescription>Church profile information.</DialogDescription>
      </DialogHeader>
      <DialogPanel>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <ChurchProfileField label="Slug">
            <code className="font-mono text-sm">{church.slug}</code>
          </ChurchProfileField>
          <ChurchProfileField label="City">{church.city || "Not provided"}</ChurchProfileField>
          <ChurchProfileField label="State or province">
            {church.state_or_province || "Not provided"}
          </ChurchProfileField>
          <ChurchProfileField label="Country code">
            {church.country_code || "Not provided"}
          </ChurchProfileField>
          <ChurchProfileField label="Time zone">
            {church.timezone || "Not provided"}
          </ChurchProfileField>
          <ChurchProfileField label="Website">
            {church.website ? (
              <a
                className="text-primary break-all hover:underline"
                href={church.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                {church.website}
              </a>
            ) : (
              "Not provided"
            )}
          </ChurchProfileField>
          <ChurchProfileField label="About this church">
            {church.bio || "Not provided"}
          </ChurchProfileField>
        </dl>
      </DialogPanel>
    </DialogPopup>
  )
}
