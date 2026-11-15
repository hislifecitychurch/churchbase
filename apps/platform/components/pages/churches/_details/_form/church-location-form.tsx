"use client"

import { useState } from "react"
import type * as React from "react"

import { useUpdateChurch } from "@/hooks/api/churches/use-update-church"
import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import type { Church } from "@/api/churches/list"

import { Button } from "@packages/ui-w/shared/button/button"

import { ChurchCityField } from "@/components/pages/churches/_details/_form/_field/church-city-field"
import { ChurchCountryCodeField } from "@/components/pages/churches/_details/_form/_field/church-country-code-field"
import { ChurchStateOrProvinceField } from "@/components/pages/churches/_details/_form/_field/church-state-or-province-field"

type ChurchLocationFormProps = {
  church: Church
}

export function ChurchLocationForm({ church }: ChurchLocationFormProps): React.ReactElement | null {
  const [city, setCity] = useState(church.city ?? "")
  const [stateOrProvince, setStateOrProvince] = useState(church.state_or_province ?? "")
  const [countryCode, setCountryCode] = useState(church.country_code ?? "")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const currentUser = useCurrentUser()
  const updateChurch = useUpdateChurch()

  if (currentUser.data?.global_roles !== "admin") {
    return null
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)
    setIsSaved(false)

    const location = {
      city: city.trim(),
      stateOrProvince: stateOrProvince.trim(),
      countryCode: countryCode.trim().toUpperCase(),
    }

    try {
      await updateChurch.mutateAsync({
        churchID: church.id,
        input: {
          name: church.name,
          timezone: church.timezone,
          website: church.website,
          bio: church.bio,
          city: location.city || null,
          state_or_province: location.stateOrProvince || null,
          country_code: location.countryCode || null,
        },
      })
      setCity(location.city)
      setStateOrProvince(location.stateOrProvince)
      setCountryCode(location.countryCode)
      setIsSaved(true)
    } catch {
      setErrorMessage(
        "We couldn't save this church location. Check the country code and try again.",
      )
    }
  }

  return (
    <form className="flex flex-col gap-4 rounded-xl border p-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-lg font-medium">Edit location</h2>
        <p className="text-muted-foreground text-sm">
          Enter a city, state or province, and two-letter country code.
        </p>
      </div>
      <ChurchCityField
        disabled={updateChurch.isPending}
        onChange={(event) => {
          setCity(event.target.value)
          setIsSaved(false)
        }}
        value={city}
      />
      <ChurchStateOrProvinceField
        disabled={updateChurch.isPending}
        onChange={(event) => {
          setStateOrProvince(event.target.value)
          setIsSaved(false)
        }}
        value={stateOrProvince}
      />
      <ChurchCountryCodeField
        disabled={updateChurch.isPending}
        onChange={(value) => {
          setCountryCode(value)
          setIsSaved(false)
        }}
        value={countryCode}
      />
      {errorMessage ? (
        <p aria-live="polite" className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {isSaved ? (
        <p aria-live="polite" className="text-muted-foreground text-sm" role="status">
          Location saved.
        </p>
      ) : null}
      <div>
        <Button
          aria-busy={updateChurch.isPending}
          disabled={updateChurch.isPending}
          size="lg"
          type="submit"
        >
          {updateChurch.isPending ? "Saving…" : "Save location"}
        </Button>
      </div>
    </form>
  )
}
