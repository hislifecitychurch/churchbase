"use client"

import type * as React from "react"

import {
  UpdateChurchLocationField,
  type UpdateChurchLocationFieldProps,
} from "./update-church-location-field"

type UpdateChurchCityFieldProps = Omit<
  UpdateChurchLocationFieldProps,
  "id" | "label" | "manualPlaceholder" | "searchPlaceholder"
>

export function UpdateChurchCityField(props: UpdateChurchCityFieldProps): React.ReactElement {
  return (
    <UpdateChurchLocationField
      {...props}
      id="church-city"
      label="City"
      manualPlaceholder="Enter a city"
      searchPlaceholder="Search cities..."
    />
  )
}
