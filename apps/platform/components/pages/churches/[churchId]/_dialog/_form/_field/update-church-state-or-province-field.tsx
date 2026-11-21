"use client"

import type * as React from "react"

import {
  UpdateChurchLocationField,
  type UpdateChurchLocationFieldProps,
} from "./update-church-location-field"

type UpdateChurchStateOrProvinceFieldProps = Omit<
  UpdateChurchLocationFieldProps,
  "id" | "label" | "manualPlaceholder" | "searchPlaceholder"
>

export function UpdateChurchStateOrProvinceField(
  props: UpdateChurchStateOrProvinceFieldProps,
): React.ReactElement {
  return (
    <UpdateChurchLocationField
      {...props}
      id="church-state-or-province"
      label="State or province"
      manualPlaceholder="Enter a state or province"
      searchPlaceholder="Search states or provinces..."
    />
  )
}
