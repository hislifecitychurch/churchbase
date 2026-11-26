import type MapLibreGL from "maplibre-gl"

import type { MapViewport } from "@packages/ui-w/types/map"

export function getMapViewport(map: MapLibreGL.Map): MapViewport {
  const center = map.getCenter()

  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  }
}
