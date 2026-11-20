"use client"

import { useState } from "react"
import type * as React from "react"
import countryData from "country-list/data.json"

import type { Church } from "@/api/churches/get-all"
import { useUpdateChurch } from "@/hooks/api/churches/use-update-church"
import type { UpdateChurchInput } from "@/api/churches/update"

import { ComboboxSearchInput } from "@packages/ui-w/shared/combobox-variant/combobox-search-input"

import { Button } from "@packages/ui-w/shared/button/button"
import { DialogClose } from "@packages/ui-w/shared/dialog/dialog-close"
import { DialogFooter } from "@packages/ui-w/shared/dialog/dialog-footer"
import { DialogPanel } from "@packages/ui-w/shared/dialog/dialog-panel"
import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"
import { Textarea } from "@packages/ui-w/shared/textarea/textarea"

type ChurchProfileFormValues = {
  name: string
  timezone: string
  website: string
  bio: string
  city: string
  state_or_province: string
  country_code: string
}

type PickerOption = {
  label: string
  value: string
}

const NO_SELECTION = "__none__"
const COUNTRY_OPTIONS: PickerOption[] = countryData
  .map(({ code, name }) => ({ label: name, value: code }))
  .sort((a, b) => a.label.localeCompare(b.label))
const TIME_ZONE_OPTIONS: PickerOption[] = ["UTC", ...(Intl.supportedValuesOf?.("timeZone") ?? [])]
  .map((timeZone) => ({ label: timeZone, value: timeZone }))
  .sort((a, b) => a.label.localeCompare(b.label))

type ChurchProfileInputProps = {
  autoComplete?: string
  disabled: boolean
  id: string
  label: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: "text" | "url"
  value: string
}

function ChurchProfileInput({
  autoComplete,
  disabled,
  id,
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: ChurchProfileInputProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        autoComplete={autoComplete}
        disabled={disabled}
        id={id}
        nativeInput
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        required={required}
        size="lg"
        type={type}
        value={value}
      />
    </Field>
  )
}

type UpdateChurchProfileFormProps = {
  church: Church
  onUpdated: () => void
}

export function UpdateChurchProfileForm({
  church,
  onUpdated,
}: UpdateChurchProfileFormProps): React.ReactElement {
  const [values, setValues] = useState<ChurchProfileFormValues>(() => ({
    name: church.name,
    timezone: church.timezone ?? "",
    website: church.website ?? "",
    bio: church.bio ?? "",
    city: church.city ?? "",
    state_or_province: church.state_or_province ?? "",
    country_code: church.country_code ?? "",
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const updateChurch = useUpdateChurch()

  function setField(field: keyof ChurchProfileFormValues, value: string): void {
    setValues((current) => ({ ...current, [field]: value }))
    setErrorMessage(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    const input: UpdateChurchInput = {
      name: values.name.trim(),
      timezone: values.timezone.trim() || null,
      website: values.website.trim() || null,
      bio: values.bio.trim() || null,
      city: values.city.trim() || null,
      state_or_province: values.state_or_province.trim() || null,
      country_code: values.country_code.trim() || null,
    }

    if (!input.name) {
      setErrorMessage("Church name is required.")
      return
    }

    try {
      await updateChurch.mutateAsync({ churchId: church.id, input })
      onUpdated()
    } catch {
      setErrorMessage("We couldn't update this church profile. Check the details and try again.")
    }
  }

  const isPending = updateChurch.isPending
  const countryValue =
    COUNTRY_OPTIONS.find((option) => option.value === values.country_code) ?? null
  const timeZoneValue = TIME_ZONE_OPTIONS.find((option) => option.value === values.timezone) ?? null

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={(event) => void handleSubmit(event)}>
      <DialogPanel className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          <ChurchProfileInput
            autoComplete="organization"
            disabled={isPending}
            id="church-name"
            label="Church name"
            onChange={(value) => setField("name", value)}
            required
            value={values.name}
          />
          <ChurchProfileInput
            autoComplete="address-level2"
            disabled={isPending}
            id="church-city"
            label="City"
            onChange={(value) => setField("city", value)}
            value={values.city}
          />
          <ChurchProfileInput
            autoComplete="address-level1"
            disabled={isPending}
            id="church-state-or-province"
            label="State or province"
            onChange={(value) => setField("state_or_province", value)}
            value={values.state_or_province}
          />
          <Field className="w-full">
            <FieldLabel htmlFor="church-country-code">Country</FieldLabel>
            <ComboboxSearchInput
              disabled={isPending}
              id="church-country-code"
              items={[{ label: "Not provided", value: NO_SELECTION }, ...COUNTRY_OPTIONS]}
              onValueChange={(option) =>
                setField(
                  "country_code",
                  option?.value && option.value !== NO_SELECTION ? option.value : "",
                )
              }
              placeholder="Select a country"
              searchPlaceholder="Search countries..."
              value={countryValue}
            />
          </Field>
          <Field className="w-full">
            <FieldLabel htmlFor="church-timezone">Time zone</FieldLabel>
            <ComboboxSearchInput
              disabled={isPending}
              id="church-timezone"
              items={[{ label: "Not provided", value: NO_SELECTION }, ...TIME_ZONE_OPTIONS]}
              onValueChange={(option) =>
                setField(
                  "timezone",
                  option?.value && option.value !== NO_SELECTION ? option.value : "",
                )
              }
              placeholder="Select a time zone"
              searchPlaceholder="Search time zones..."
              value={timeZoneValue}
            />
          </Field>
          <ChurchProfileInput
            disabled={isPending}
            id="church-website"
            label="Website"
            onChange={(value) => setField("website", value)}
            placeholder="https://example.org"
            type="url"
            value={values.website}
          />
          <Field className="w-full sm:col-span-2">
            <FieldLabel htmlFor="church-bio">About this church</FieldLabel>
            <Textarea
              disabled={isPending}
              id="church-bio"
              name="bio"
              onChange={(event) => setField("bio", event.currentTarget.value)}
              rows={4}
              value={values.bio}
            />
          </Field>
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
            <Button disabled={isPending} size="lg" type="button" variant="outline">
              Cancel
            </Button>
          }
        />
        <Button aria-busy={isPending} disabled={isPending} size="lg" type="submit">
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
