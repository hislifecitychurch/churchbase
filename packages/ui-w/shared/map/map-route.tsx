"use client"

import * as React from "react"
import type MapLibreGL from "maplibre-gl"

import { useMap } from "@packages/ui-w/hooks/use-map"
import type { MapRouteProps } from "@packages/ui-w/types/map"

export function MapRoute({
  id: propId,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive = true,
}: MapRouteProps): null {
  const { map, isLoaded } = useMap()
  const autoId = React.useId()
  const id = propId ?? autoId
  const sourceId = `route-source-${id}`
  const layerId = `route-layer-${id}`

  React.useEffect(() => {
    if (!isLoaded || !map) {
      return
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    })

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": color,
        "line-width": width,
        "line-opacity": opacity,
        ...(dashArray && { "line-dasharray": dashArray }),
      },
    })

    return () => {
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId)
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId)
        }
      } catch {
        // Ignore MapLibre cleanup races during style changes.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map])

  React.useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) {
      return
    }

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource
    source?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    })
  }, [isLoaded, map, coordinates, sourceId])

  React.useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(layerId)) {
      return
    }

    map.setPaintProperty(layerId, "line-color", color)
    map.setPaintProperty(layerId, "line-width", width)
    map.setPaintProperty(layerId, "line-opacity", opacity)
    if (dashArray) {
      map.setPaintProperty(layerId, "line-dasharray", dashArray)
    }
  }, [isLoaded, map, layerId, color, width, opacity, dashArray])

  React.useEffect(() => {
    if (!isLoaded || !map || !interactive) {
      return
    }

    const handleClick = () => {
      onClick?.()
    }
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer"
      onMouseEnter?.()
    }
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = ""
      onMouseLeave?.()
    }

    map.on("click", layerId, handleClick)
    map.on("mouseenter", layerId, handleMouseEnter)
    map.on("mouseleave", layerId, handleMouseLeave)

    return () => {
      map.off("click", layerId, handleClick)
      map.off("mouseenter", layerId, handleMouseEnter)
      map.off("mouseleave", layerId, handleMouseLeave)
    }
  }, [isLoaded, map, layerId, onClick, onMouseEnter, onMouseLeave, interactive])

  return null
}
