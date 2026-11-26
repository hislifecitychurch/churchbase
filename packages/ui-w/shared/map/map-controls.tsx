"use client"

import * as React from "react"
import {
  IconCurrentLocation,
  IconLoader2,
  IconMaximize,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"
import { useMap } from "@packages/ui-w/hooks/use-map"
import type { MapControlsProps } from "@packages/ui-w/types/map"

import { MapCompassButton } from "@packages/ui-w/shared/map/map-compass-button"
import { MapControlButton } from "@packages/ui-w/shared/map/map-control-button"
import { MapControlGroup } from "@packages/ui-w/shared/map/map-control-group"

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
}

export function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}: MapControlsProps): React.ReactElement {
  const { map } = useMap()
  const [waitingForLocation, setWaitingForLocation] = React.useState(false)

  const handleZoomIn = React.useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 })
  }, [map])

  const handleZoomOut = React.useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 })
  }, [map])

  const handleResetBearing = React.useCallback(() => {
    map?.resetNorthPitch({ duration: 300 })
  }, [map])

  const handleLocate = React.useCallback(() => {
    setWaitingForLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          }
          map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          })
          onLocate?.(coords)
          setWaitingForLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setWaitingForLocation(false)
        },
      )
    }
  }, [map, onLocate])

  const handleFullscreen = React.useCallback(() => {
    const container = map?.getContainer()
    if (!container) {
      return
    }
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }, [map])

  return (
    <div
      className={cn("absolute z-10 flex flex-col gap-1.5", positionClasses[position], className)}
    >
      {showZoom && (
        <MapControlGroup>
          <MapControlButton onClick={handleZoomIn} label="Zoom in">
            <IconPlus className="size-4" />
          </MapControlButton>
          <MapControlButton onClick={handleZoomOut} label="Zoom out">
            <IconMinus className="size-4" />
          </MapControlButton>
        </MapControlGroup>
      )}
      {showCompass && (
        <MapControlGroup>
          <MapCompassButton onClick={handleResetBearing} />
        </MapControlGroup>
      )}
      {showLocate && (
        <MapControlGroup>
          <MapControlButton
            onClick={handleLocate}
            label="Find my location"
            disabled={waitingForLocation}
          >
            {waitingForLocation ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconCurrentLocation className="size-4" />
            )}
          </MapControlButton>
        </MapControlGroup>
      )}
      {showFullscreen && (
        <MapControlGroup>
          <MapControlButton onClick={handleFullscreen} label="Toggle fullscreen">
            <IconMaximize className="size-4" />
          </MapControlButton>
        </MapControlGroup>
      )}
    </div>
  )
}
