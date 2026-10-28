"use client"

import { createPortal } from "react-dom"

import { cn } from "@packages/ui-w/lib/utils"
import { useMarkerContext } from "@packages/ui-w/hooks/use-marker-context"
import type { MapMarkerContentProps } from "@packages/ui-w/types/map"

import { MapMarkerIcon } from "@packages/ui-w/shared/map/map-marker-icon"

export function MapMarkerContent({
  children,
  className,
}: MapMarkerContentProps): React.ReactPortal {
  const { marker } = useMarkerContext()

  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>{children || <MapMarkerIcon />}</div>,
    marker.getElement(),
  )
}
