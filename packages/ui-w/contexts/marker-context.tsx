"use client"

import * as React from "react"
import MapLibreGL from "maplibre-gl"

export type MarkerContextValue = {
  marker: MapLibreGL.Marker
  map: MapLibreGL.Map | null
}

export const MarkerContext = React.createContext<MarkerContextValue | null>(null)
