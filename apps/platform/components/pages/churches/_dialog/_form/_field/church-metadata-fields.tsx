"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"
import { Textarea } from "@packages/ui-w/shared/textarea/textarea"

export type ChurchMetadataValues = {
  timezone: string
  website: string
  bio: string
}

type ChurchMetadataFieldsProps = {
  disabled?: boolean
  onChange: (field: keyof ChurchMetadataValues, value: string) => void
  value: ChurchMetadataValues
}

export function ChurchMetadataFields({
  disabled,
  onChange,
  value,
}: ChurchMetadataFieldsProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Field className="w-full">
        <FieldLabel htmlFor="church-timezone">Time zone</FieldLabel>
        <Input
          disabled={disabled}
          id="church-timezone"
          name="timezone"
          nativeInput
          onChange={(event) => onChange("timezone", event.target.value)}
          placeholder="America/Chicago"
          size="lg"
          value={value.timezone}
        />
      </Field>
      <Field className="w-full">
        <FieldLabel htmlFor="church-website">Website</FieldLabel>
        <Input
          autoComplete="url"
          disabled={disabled}
          id="church-website"
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
        <FieldLabel htmlFor="church-bio">About this church</FieldLabel>
        <Textarea
          disabled={disabled}
          id="church-bio"
          name="bio"
          onChange={(event) => onChange("bio", event.target.value)}
          placeholder="A short description of this church"
          value={value.bio}
        />
      </Field>
    </div>
  )
}
