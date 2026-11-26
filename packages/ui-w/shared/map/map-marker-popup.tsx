"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import MapLibreGL from "maplibre-gl"

import { cn } from "@packages/ui-w/lib/utils"
import { useMarkerContext } from "@packages/ui-w/hooks/use-marker-context"
import type { MapMarkerPopupProps } from "@packages/ui-w/types/map"

import { MapPopupCloseButton } from "@packages/ui-w/shared/map/map-popup-close-button"

export function MapMarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MapMarkerPopupProps): React.ReactPortal {
  const { marker, map } = useMarkerContext()
  const container = React.useMemo(() => document.createElement("div"), [])
  const prevPopupOptions = React.useRef(popupOptions)

  const popup = React.useMemo(() => {
    return new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!map) {
      return
    }

    popup.setDOMContent(container)
    marker.setPopup(popup)

    return () => {
      marker.setPopup(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (popup.isOpen()) {
    const prev = prevPopupOptions.current

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? "none")
    }

    prevPopupOptions.current = popupOptions
  }

  const handleClose = () => popup.remove()

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
