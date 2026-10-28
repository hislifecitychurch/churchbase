"use client"

import { useEffect, useMemo, useRef } from "react"
import { createPortal } from "react-dom"
import MapLibreGL from "maplibre-gl"

import { cn } from "@packages/ui-w/lib/utils"
import { useMarkerContext } from "@packages/ui-w/hooks/use-marker-context"
import type { MapMarkerTooltipProps } from "@packages/ui-w/types/map"

export function MapMarkerTooltip({
  children,
  className,
  ...popupOptions
}: MapMarkerTooltipProps): React.ReactPortal {
  const { marker, map } = useMarkerContext()
  const container = useMemo(() => document.createElement("div"), [])
  const prevTooltipOptions = useRef(popupOptions)

  const tooltip = useMemo(() => {
    return new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    }).setMaxWidth("none")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) {
      return
    }

    tooltip.setDOMContent(container)

    const handleMouseEnter = () => {
      tooltip.setLngLat(marker.getLngLat()).addTo(map)
    }
    const handleMouseLeave = () => tooltip.remove()

    marker.getElement()?.addEventListener("mouseenter", handleMouseEnter)
    marker.getElement()?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      marker.getElement()?.removeEventListener("mouseenter", handleMouseEnter)
      marker.getElement()?.removeEventListener("mouseleave", handleMouseLeave)
      tooltip.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (tooltip.isOpen()) {
    const prev = prevTooltipOptions.current

    if (prev.offset !== popupOptions.offset) {
      tooltip.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      tooltip.setMaxWidth(popupOptions.maxWidth ?? "none")
    }

    prevTooltipOptions.current = popupOptions
  }

  return createPortal(
    <div
      className={cn(
        "bg-foreground text-background pointer-events-none rounded-xl px-2 py-1 text-xs text-balance",
        "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
        className,
      )}
    >
      {children}
    </div>,
    container,
  )
}
