"use client"

import { createPortal } from "react-dom"

import { cn } from "@repo/ui-w/lib/utils"
import { useMarkerContext } from "@repo/ui-w/hooks/use-marker-context"
import type { MapMarkerContentProps } from "@repo/ui-w/types/map"

import { MapMarkerIcon } from "@repo/ui-w/shared/map/map-marker-icon"

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
