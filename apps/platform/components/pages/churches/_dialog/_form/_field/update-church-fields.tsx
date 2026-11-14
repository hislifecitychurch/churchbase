"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"
import { Textarea } from "@packages/ui-w/shared/textarea/textarea"

export type UpdateChurchValues = {
  name: string
  timezone: string
  website: string
  bio: string
}

type UpdateChurchFieldsProps = {
  disabled?: boolean
  onChange: (field: keyof UpdateChurchValues, value: string) => void
  slug: string
  value: UpdateChurchValues
}

export function UpdateChurchFields({
  disabled,
  onChange,
  slug,
  value,
}: UpdateChurchFieldsProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Field className="w-full">
        <FieldLabel htmlFor="update-church-name">Church name</FieldLabel>
        <Input
          autoComplete="organization"
          disabled={disabled}
          id="update-church-name"
          name="name"
          nativeInput
          onChange={(event) => onChange("name", event.target.value)}
          required
          size="lg"
          value={value.name}
        />
      </Field>
      <p className="text-muted-foreground text-sm">Church slug “{slug}” remains unchanged.</p>
      <Field className="w-full">
        <FieldLabel htmlFor="update-church-timezone">Time zone</FieldLabel>
        <Input
          autoComplete="off"
          disabled={disabled}
          id="update-church-timezone"
          name="timezone"
          nativeInput
          onChange={(event) => onChange("timezone", event.target.value)}
          placeholder="America/Chicago"
          size="lg"
          value={value.timezone}
        />
      </Field>
      <Field className="w-full">
        <FieldLabel htmlFor="update-church-website">Website</FieldLabel>
        <Input
          autoComplete="url"
          disabled={disabled}
          id="update-church-website"
          name="website"
          nativeInput
          onChange={(event) => onChange("website", event.target.value)}
          placeholder="https://example.org"
          size="lg"
          type="url"
          value={value.website}
        />
      </Field>
      <Field className="w-full">
        <FieldLabel htmlFor="update-church-bio">About this church</FieldLabel>
        <Textarea
          disabled={disabled}
          id="update-church-bio"
          name="bio"
          onChange={(event) => onChange("bio", event.target.value)}
          placeholder="A short description of this church"
          value={value.bio}
        />
      </Field>
    </div>
  )
}
