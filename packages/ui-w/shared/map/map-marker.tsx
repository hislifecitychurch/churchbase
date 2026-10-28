"use client"

import * as React from "react"
import MapLibreGL from "maplibre-gl"

import { useMap } from "@packages/ui-w/hooks/use-map"
import { MarkerContext } from "@packages/ui-w/contexts/marker-context"
import type { MapMarkerProps } from "@packages/ui-w/types/map"

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps): React.ReactElement {
  const { map } = useMap()

  const callbacksRef = React.useRef({
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  })

  callbacksRef.current = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  }

  const marker = React.useMemo(() => {
    const markerInstance = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement("div"),
      draggable,
    }).setLngLat([longitude, latitude])

    const handleClick = (e: MouseEvent) => callbacksRef.current.onClick?.(e)
    const handleMouseEnter = (e: MouseEvent) => callbacksRef.current.onMouseEnter?.(e)
    const handleMouseLeave = (e: MouseEvent) => callbacksRef.current.onMouseLeave?.(e)

    markerInstance.getElement()?.addEventListener("click", handleClick)
    markerInstance.getElement()?.addEventListener("mouseenter", handleMouseEnter)
    markerInstance.getElement()?.addEventListener("mouseleave", handleMouseLeave)

    const handleDragStart = () => {
      const lngLat = markerInstance.getLngLat()
      callbacksRef.current.onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat })
    }
    const handleDrag = () => {
      const lngLat = markerInstance.getLngLat()
      callbacksRef.current.onDrag?.({ lng: lngLat.lng, lat: lngLat.lat })
    }
    const handleDragEnd = () => {
      const lngLat = markerInstance.getLngLat()
      callbacksRef.current.onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat })
    }

    markerInstance.on("dragstart", handleDragStart)
    markerInstance.on("drag", handleDrag)
    markerInstance.on("dragend", handleDragEnd)

    return markerInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!map) {
      return
    }

    marker.addTo(map)

    return () => {
      marker.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (marker.getLngLat().lng !== longitude || marker.getLngLat().lat !== latitude) {
    marker.setLngLat([longitude, latitude])
  }

  if (marker.isDraggable() !== draggable) {
    marker.setDraggable(draggable)
  }

  const currentOffset = marker.getOffset()
  const newOffset = markerOptions.offset ?? [0, 0]
  const [newOffsetX, newOffsetY] = Array.isArray(newOffset) ? newOffset : [newOffset.x, newOffset.y]

  if (currentOffset.x !== newOffsetX || currentOffset.y !== newOffsetY) {
    marker.setOffset(newOffset)
  }

  if (marker.getRotation() !== markerOptions.rotation) {
    marker.setRotation(markerOptions.rotation ?? 0)
  }
  if (marker.getRotationAlignment() !== markerOptions.rotationAlignment) {
    marker.setRotationAlignment(markerOptions.rotationAlignment ?? "auto")
  }
  if (marker.getPitchAlignment() !== markerOptions.pitchAlignment) {
    marker.setPitchAlignment(markerOptions.pitchAlignment ?? "auto")
  }

  return <MarkerContext.Provider value={{ marker, map }}>{children}</MarkerContext.Provider>
}
