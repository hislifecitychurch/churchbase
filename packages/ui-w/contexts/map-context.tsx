"use client"

import * as React from "react"
import MapLibreGL from "maplibre-gl"

export type MapContextValue = {
  map: MapLibreGL.Map | null
  isLoaded: boolean
}

export const MapContext = React.createContext<MapContextValue | null>(null)
