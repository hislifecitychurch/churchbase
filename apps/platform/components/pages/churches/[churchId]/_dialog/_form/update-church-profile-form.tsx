"use client"

import { useEffect, useRef, useState } from "react"
import type * as React from "react"
import { useQuery } from "@tanstack/react-query"

import type { Church } from "@/api/churches/get-all"
import { useUpdateChurch } from "@/hooks/api/churches/use-update-church"
import type { UpdateChurchInput } from "@/api/churches/update"
import {
  getDefaultTimezoneForCountry,
  getTimezoneAfterCountryChange,
} from "@/lib/churches/get-default-timezone-for-country"
import {
  getCitiesOfState,
  getCountries,
  getCountryTimezones,
  getStatesOfCountry,
} from "@/lib/location-data"
import type { ICity, ICountry, IState } from "@/lib/location-data"

import {
  ComboboxSearchInput,
  type ComboboxSearchInputItem,
} from "@packages/ui-w/shared/combobox-variant/combobox-search-input"

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
const MANUAL_VALUE = "__manual__"
const TIME_ZONE_OPTIONS: PickerOption[] = [
  { label: "UTC", value: "UTC" },
  ...(Intl.supportedValuesOf?.("timeZone") ?? []).map((timeZone) => ({
    label: timeZone,
    value: timeZone,
  })),
].sort((a, b) => a.label.localeCompare(b.label))

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

type ChurchProfileLocationFieldProps = {
  disabled: boolean
  emptyLabel: string
  id: string
  items: ComboboxSearchInputItem[]
  label: string
  manual: boolean
  manualPlaceholder: string
  manualValue: string
  onManualChange: (value: string) => void
  onToggleManual: () => void
  onValueChange: (value: ComboboxSearchInputItem | null) => void
  pickerDisabled: boolean
  placeholder: string
  searchPlaceholder: string
  value: ComboboxSearchInputItem | null
}

function ChurchProfileLocationField({
  disabled,
  emptyLabel,
  id,
  items,
  label,
  manual,
  manualPlaceholder,
  manualValue,
  onManualChange,
  onToggleManual,
  onValueChange,
  pickerDisabled,
  placeholder,
  searchPlaceholder,
  value,
}: ChurchProfileLocationFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Button
          aria-label={
            manual
              ? `Choose ${label.toLowerCase()} from the list`
              : `Enter ${label.toLowerCase()} manually`
          }
          disabled={disabled}
          onClick={onToggleManual}
          size="xs"
          type="button"
          variant="link"
        >
          {manual ? "Use list" : "Enter manually"}
        </Button>
      </div>
      {manual ? (
        <Input
          disabled={disabled}
          id={id}
          nativeInput
          onChange={(event) => onManualChange(event.currentTarget.value)}
          placeholder={manualPlaceholder}
          size="lg"
          value={manualValue}
        />
      ) : (
        <ComboboxSearchInput
          disabled={disabled || pickerDisabled}
          emptyLabel={emptyLabel}
          id={id}
          items={items}
          onValueChange={onValueChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          value={value}
        />
      )}
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
  const [stateManual, setStateManual] = useState(false)
  const [cityManual, setCityManual] = useState(false)
  const pendingTimezoneUpdate = useRef(false)
  const timezoneInitializationComplete = useRef(false)
  const updateChurch = useUpdateChurch()

  const countriesQuery = useQuery({
    queryKey: ["location-data", "countries"],
    queryFn: getCountries,
    staleTime: Infinity,
  })
  const statesQuery = useQuery({
    queryKey: ["location-data", "states", values.country_code],
    queryFn: () => getStatesOfCountry(values.country_code),
    enabled: Boolean(values.country_code),
    staleTime: Infinity,
  })
  const timezonesQuery = useQuery({
    queryKey: ["location-data", "timezones", values.country_code],
    queryFn: () => getCountryTimezones(values.country_code),
    enabled: Boolean(values.country_code),
    staleTime: Infinity,
  })

  const countries: ICountry[] = countriesQuery.data ?? []
  const states: IState[] = statesQuery.data ?? []
  const selectedState = states.find((state) => {
    const current = values.state_or_province.trim().toLowerCase()
    return state.name.trim().toLowerCase() === current || state.iso2.toLowerCase() === current
  })
  const selectedStateCode = selectedState?.iso2 ?? null
  const citiesQuery = useQuery({
    queryKey: ["location-data", "cities", values.country_code, selectedStateCode],
    queryFn: () => getCitiesOfState(values.country_code, states.length ? selectedStateCode : null),
    enabled:
      Boolean(values.country_code) &&
      statesQuery.isSuccess &&
      (!states.length || Boolean(selectedStateCode)),
    staleTime: Infinity,
  })
  const cities: ICity[] = citiesQuery.data ?? []
  const selectedCity = cities.find(
    (city) => city.name.trim().toLowerCase() === values.city.trim().toLowerCase(),
  )
  const countryOptions: PickerOption[] = countries
    .map(({ iso2, name }) => ({ label: name, value: iso2 }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const stateOptions: PickerOption[] = states.map((state) => ({
    label: state.name,
    value: state.iso2,
  }))
  const cityOptions: PickerOption[] = cities.map((city) => ({
    label: city.name,
    value: String(city.id),
  }))
  const countryValue =
    countryOptions.find((option) => option.value === values.country_code) ??
    (values.country_code ? { label: values.country_code, value: values.country_code } : null)
  const countryItems = [
    { label: "Not provided", value: NO_SELECTION },
    ...(countryValue && !countryOptions.some((option) => option.value === countryValue.value)
      ? [countryValue]
      : []),
    ...countryOptions,
  ]
  const stateValue = selectedState
    ? { label: selectedState.name, value: selectedState.iso2 }
    : values.state_or_province
      ? { label: values.state_or_province, value: MANUAL_VALUE }
      : null
  const stateItems = [
    { label: "Not provided", value: NO_SELECTION },
    ...(!selectedState && stateValue ? [stateValue] : []),
    ...stateOptions,
  ]
  const cityValue = selectedCity
    ? { label: selectedCity.name, value: String(selectedCity.id) }
    : values.city
      ? { label: values.city, value: MANUAL_VALUE }
      : null
  const cityItems = [
    { label: "Not provided", value: NO_SELECTION },
    ...(!selectedCity && cityValue ? [cityValue] : []),
    ...cityOptions,
  ]
  const availableTimeZones =
    timezonesQuery.isSuccess && timezonesQuery.data?.length
      ? timezonesQuery.data.map((timeZone) => ({ label: timeZone, value: timeZone }))
      : TIME_ZONE_OPTIONS
  const timeZoneOptions =
    values.timezone && !availableTimeZones.some((option) => option.value === values.timezone)
      ? [{ label: values.timezone, value: values.timezone }, ...availableTimeZones]
      : availableTimeZones
  const timeZoneValue = timeZoneOptions.find((option) => option.value === values.timezone) ?? null

  function setField(field: keyof ChurchProfileFormValues, value: string): void {
    setValues((current) => ({ ...current, [field]: value }))
    setErrorMessage(null)
  }

  function setCountry(countryCode: string): void {
    if (countryCode === values.country_code) return

    pendingTimezoneUpdate.current = true
    setValues((current) => ({
      ...current,
      country_code: countryCode,
      state_or_province: "",
      city: "",
    }))
    setStateManual(false)
    setCityManual(false)
    setErrorMessage(null)
  }

  function setStateFromOption(option: ComboboxSearchInputItem | null): void {
    if (!option || option.value === NO_SELECTION) {
      setValues((current) => ({ ...current, state_or_province: "", city: "" }))
      setStateManual(false)
      setCityManual(states.length > 0)
    } else if (option.value === MANUAL_VALUE) {
      setStateManual(true)
      setCityManual(states.length > 0)
    } else {
      const state = states.find((candidate) => candidate.iso2 === option.value)
      if (!state) return

      setValues((current) => ({ ...current, state_or_province: state.name, city: "" }))
      setStateManual(false)
      setCityManual(false)
    }
    setErrorMessage(null)
  }

  function setCityFromOption(option: ComboboxSearchInputItem | null): void {
    if (!option || option.value === NO_SELECTION) {
      setField("city", "")
      setCityManual(false)
      return
    }
    if (option.value === MANUAL_VALUE) {
      setCityManual(true)
      return
    }

    const city = cities.find((candidate) => String(candidate.id) === option.value)
    if (!city) return

    setValues((current) => ({
      ...current,
      city: city.name,
      timezone: city.timezone || current.timezone,
    }))
    setCityManual(false)
    setErrorMessage(null)
  }

  useEffect(() => {
    if (!values.country_code) {
      pendingTimezoneUpdate.current = false
      timezoneInitializationComplete.current = true
      return
    }
    if (!timezonesQuery.isSuccess) return

    if (pendingTimezoneUpdate.current) {
      pendingTimezoneUpdate.current = false
      setValues((current) => {
        if (current.country_code !== values.country_code) return current
        const timezone = getTimezoneAfterCountryChange(timezonesQuery.data ?? [], current.timezone)
        return timezone === current.timezone ? current : { ...current, timezone }
      })
      return
    }

    if (!timezoneInitializationComplete.current) {
      timezoneInitializationComplete.current = true
      setValues((current) => {
        if (current.country_code !== values.country_code || current.timezone) return current
        const timezone = getDefaultTimezoneForCountry(timezonesQuery.data ?? [])
        return timezone ? { ...current, timezone } : current
      })
    }
  }, [values.country_code, timezonesQuery.data, timezonesQuery.isSuccess])

  useEffect(() => {
    if (!selectedCity?.timezone) return

    setValues((current) =>
      current.city === selectedCity.name && !current.timezone
        ? { ...current, timezone: selectedCity.timezone ?? "" }
        : current,
    )
  }, [selectedCity?.id])

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
          <Field className="w-full">
            <FieldLabel htmlFor="church-country-code">Country</FieldLabel>
            <ComboboxSearchInput
              disabled={isPending || countriesQuery.isLoading}
              emptyLabel={
                countriesQuery.isError ? "Countries could not be loaded." : "No countries found."
              }
              id="church-country-code"
              items={countryItems}
              onValueChange={(option) =>
                setCountry(option?.value && option.value !== NO_SELECTION ? option.value : "")
              }
              placeholder="Select a country"
              searchPlaceholder="Search countries..."
              value={countryValue}
            />
          </Field>
          <Field className="w-full">
            <FieldLabel htmlFor="church-timezone">Time zone</FieldLabel>
            <ComboboxSearchInput
              disabled={isPending || Boolean(values.country_code && timezonesQuery.isLoading)}
              emptyLabel={
                timezonesQuery.isLoading ? "Loading time zones..." : "No time zones found."
              }
              id="church-timezone"
              items={[{ label: "Not provided", value: NO_SELECTION }, ...timeZoneOptions]}
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
          <ChurchProfileLocationField
            disabled={isPending}
            emptyLabel={
              statesQuery.isLoading
                ? "Loading states or provinces..."
                : "No matching states or provinces."
            }
            id="church-state-or-province"
            items={stateItems}
            label="State or province"
            manual={stateManual}
            manualPlaceholder="Enter a state or province"
            manualValue={values.state_or_province}
            onManualChange={(value) => setField("state_or_province", value)}
            onToggleManual={() => setStateManual((current) => !current)}
            onValueChange={setStateFromOption}
            pickerDisabled={!values.country_code || statesQuery.isLoading}
            placeholder={
              values.country_code ? "Select a state or province" : "Select a country first"
            }
            searchPlaceholder="Search states or provinces..."
            value={stateValue}
          />
          <ChurchProfileLocationField
            disabled={isPending}
            emptyLabel={citiesQuery.isLoading ? "Loading cities..." : "No matching cities."}
            id="church-city"
            items={cityItems}
            label="City"
            manual={cityManual}
            manualPlaceholder="Enter a city"
            manualValue={values.city}
            onManualChange={(value) => setField("city", value)}
            onToggleManual={() => setCityManual((current) => !current)}
            onValueChange={setCityFromOption}
            pickerDisabled={
              !values.country_code ||
              !citiesQuery.isSuccess ||
              (states.length > 0 && !selectedStateCode)
            }
            placeholder={
              !values.country_code
                ? "Select a country first"
                : states.length > 0 && !selectedStateCode
                  ? "Select a state first"
                  : "Select a city"
            }
            searchPlaceholder="Search cities..."
            value={cityValue}
          />
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
        <p className="text-muted-foreground mt-3 text-xs">
          Location data sources:{" "}
          <a className="underline underline-offset-4" href="/location-data-attribution.html">
            view notices
          </a>
        </p>
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
