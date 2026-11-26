"use client"

import * as React from "react"

import { useMap } from "@packages/ui-w/hooks/use-map"
import { MapControlButton } from "@packages/ui-w/shared/map/map-control-button"

export function MapCompassButton({ onClick }: { onClick: () => void }): React.ReactElement {
  const { map } = useMap()
  const compassRef = React.useRef<SVGSVGElement>(null)

  React.useEffect(() => {
    if (!map || !compassRef.current) {
      return
    }

    const compass = compassRef.current

    const updateRotation = () => {
      const bearing = map.getBearing()
      const pitch = map.getPitch()
      compass.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`
    }

    map.on("rotate", updateRotation)
    map.on("pitch", updateRotation)
    updateRotation()

    return () => {
      map.off("rotate", updateRotation)
      map.off("pitch", updateRotation)
    }
  }, [map])

  return (
    <MapControlButton onClick={onClick} label="Reset bearing to north">
      <svg
        ref={compassRef}
        viewBox="0 0 24 24"
        className="size-5 transition-transform duration-200"
        style={{ transformStyle: "preserve-3d" }}
      >
        <path d="M12 2L16 12H12V2Z" className="fill-red-500" />
        <path d="M12 2L8 12H12V2Z" className="fill-red-300" />
        <path d="M12 22L16 12H12V22Z" className="fill-muted-foreground/60" />
        <path d="M12 22L8 12H12V22Z" className="fill-muted-foreground/30" />
      </svg>
    </MapControlButton>
  )
}
