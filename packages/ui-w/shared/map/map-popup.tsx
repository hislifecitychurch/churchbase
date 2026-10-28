"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import MapLibreGL from "maplibre-gl"

import { cn } from "@packages/ui-w/lib/utils"
import { useMap } from "@packages/ui-w/hooks/use-map"
import type { MapPopupProps } from "@packages/ui-w/types/map"

import { MapPopupCloseButton } from "@packages/ui-w/shared/map/map-popup-close-button"

export function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MapPopupProps): React.ReactPortal {
  const { map } = useMap()
  const popupOptionsRef = React.useRef(popupOptions)
  const onCloseRef = React.useRef(onClose)
  const container = React.useMemo(() => document.createElement("div"), [])

  onCloseRef.current = onClose

  const popup = React.useMemo(() => {
    return new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setLngLat([longitude, latitude])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!map) {
      return
    }

    const onCloseProp = () => onCloseRef.current?.()

    popup.on("close", onCloseProp)
    popup.setDOMContent(container)
    popup.addTo(map)

    return () => {
      popup.off("close", onCloseProp)
      if (popup.isOpen()) {
        popup.remove()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (popup.isOpen()) {
    const prev = popupOptionsRef.current

    if (popup.getLngLat().lng !== longitude || popup.getLngLat().lat !== latitude) {
      popup.setLngLat([longitude, latitude])
    }

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? "none")
    }

    popupOptionsRef.current = popupOptions
  }

  const handleClose = () => {
    popup.remove()
  }

  return createPortal(
    <div
      className={cn(
        "bg-popover text-popover-foreground relative max-w-62 rounded-xl border p-3",
        "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
        className,
      )}
    >
      {closeButton && <MapPopupCloseButton onClick={handleClose} />}
      {children}
    </div>,
    container,
  )
}
