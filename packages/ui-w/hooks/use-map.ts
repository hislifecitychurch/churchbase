"use client"

import * as React from "react"

import { MapContext } from "@repo/ui-w/contexts/map-context"

export function useMap() {
  const context = React.useContext(MapContext)
  if (!context) {
    throw new Error("useMap must be used within a Map component")
  }
  return context
}
