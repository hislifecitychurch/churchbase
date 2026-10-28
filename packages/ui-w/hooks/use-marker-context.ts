"use client"

import * as React from "react"

import { MarkerContext } from "@packages/ui-w/contexts/marker-context"

export function useMarkerContext() {
  const context = React.useContext(MarkerContext)
  if (!context) {
    throw new Error("Marker components must be used within MapMarker")
  }
  return context
}
