"use client"

import * as React from "react"
import type MapLibreGL from "maplibre-gl"
import type { FeatureCollection, LineString } from "geojson"

import { useMap } from "@packages/ui-w/hooks/use-map"
import {
  ARC_HIT_MIN_WIDTH,
  ARC_HIT_PADDING,
  buildArcCoordinates,
  DEFAULT_ARC_CURVATURE,
  DEFAULT_ARC_LAYOUT,
  DEFAULT_ARC_PAINT,
  DEFAULT_ARC_SAMPLES,
  mergeArcPaint,
} from "@packages/ui-w/helpers/map/map-arc"
import type {
  MapArcDatum,
  MapArcLineLayout,
  MapArcLinePaint,
  MapArcProps,
} from "@packages/ui-w/types/map"

export function MapArc<T extends MapArcDatum = MapArcDatum>({
  data,
  id: propId,
  curvature = DEFAULT_ARC_CURVATURE,
  samples = DEFAULT_ARC_SAMPLES,
  paint,
  layout,
  hoverPaint,
  onClick,
  onHover,
  interactive = true,
  beforeId,
}: MapArcProps<T>): null {
  const { map, isLoaded } = useMap()
  const autoId = React.useId()
  const id = propId ?? autoId
  const sourceId = `arc-source-${id}`
  const layerId = `arc-layer-${id}`
  const hitLayerId = `arc-hit-layer-${id}`

  const mergedPaint = React.useMemo(
    () => mergeArcPaint({ ...DEFAULT_ARC_PAINT, ...paint }, hoverPaint),
    [paint, hoverPaint],
  )
  const mergedLayout = React.useMemo(() => ({ ...DEFAULT_ARC_LAYOUT, ...layout }), [layout])

  const hitWidth = React.useMemo(() => {
    const w = paint?.["line-width"] ?? DEFAULT_ARC_PAINT["line-width"]
    const base = typeof w === "number" ? w : ARC_HIT_MIN_WIDTH
    return Math.max(base + ARC_HIT_PADDING, ARC_HIT_MIN_WIDTH)
  }, [paint])

  const geoJSON = React.useMemo<FeatureCollection<LineString>>(
    () => ({
      type: "FeatureCollection",
      features: data.map((arc) => {
        const { from, to, ...properties } = arc
        return {
          type: "Feature",
          properties,
          geometry: {
            type: "LineString",
            coordinates: buildArcCoordinates(from, to, curvature, samples),
          },
        }
      }),
    }),
    [data, curvature, samples],
  )

  const latestRef = React.useRef({ data, onClick, onHover })
  latestRef.current = { data, onClick, onHover }

  React.useEffect(() => {
    if (!isLoaded || !map) {
      return
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: geoJSON,
      promoteId: "id",
    })

    map.addLayer(
      {
        id: hitLayerId,
        type: "line",
        source: sourceId,
        layout: DEFAULT_ARC_LAYOUT,
        paint: {
          "line-color": "rgba(0, 0, 0, 0)",
          "line-width": hitWidth,
          "line-opacity": 1,
        },
      },
      beforeId,
    )

    map.addLayer(
      {
        id: layerId,
        type: "line",
        source: sourceId,
        layout: mergedLayout,
        paint: mergedPaint,
      },
      beforeId,
    )

    return () => {
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId)
        }
        if (map.getLayer(hitLayerId)) {
          map.removeLayer(hitLayerId)
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
    if (!isLoaded || !map) {
      return
    }

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined
    source?.setData(geoJSON)
  }, [isLoaded, map, geoJSON, sourceId])

  React.useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(layerId)) {
      return
    }

    for (const [key, value] of Object.entries(mergedPaint)) {
      map.setPaintProperty(layerId, key as keyof MapArcLinePaint, value as never)
    }
    for (const [key, value] of Object.entries(mergedLayout)) {
      map.setLayoutProperty(layerId, key as keyof MapArcLineLayout, value as never)
    }
    if (map.getLayer(hitLayerId)) {
      map.setPaintProperty(hitLayerId, "line-width", hitWidth)
    }
  }, [isLoaded, map, layerId, hitLayerId, mergedPaint, mergedLayout, hitWidth])

  React.useEffect(() => {
    if (!isLoaded || !map || !interactive) {
      return
    }

    let hoveredId: string | number | null = null

    const setHover = (next: string | number | null) => {
      if (next === hoveredId) {
        return
      }

      const sourceExists = !!map.getSource(sourceId)
      if (hoveredId != null && sourceExists) {
        map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false })
      }
      hoveredId = next
      if (next != null && sourceExists) {
        map.setFeatureState({ source: sourceId, id: next }, { hover: true })
      }
    }

    const findArc = (featureId: string | number | undefined) =>
      featureId == null
        ? undefined
        : latestRef.current.data.find((arc) => String(arc.id) === String(featureId))

    const handleMouseMove = (e: MapLibreGL.MapLayerMouseEvent) => {
      const featureId = e.features?.[0]?.id as string | number | undefined
      if (featureId == null || featureId === hoveredId) {
        return
      }

      setHover(featureId)
      map.getCanvas().style.cursor = "pointer"

      const arc = findArc(featureId)
      if (arc) {
        latestRef.current.onHover?.({
          arc: arc as T,
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
          originalEvent: e,
        })
      }
    }

    const handleMouseLeave = () => {
      setHover(null)
      map.getCanvas().style.cursor = ""
      latestRef.current.onHover?.(null)
    }

    const handleClick = (e: MapLibreGL.MapLayerMouseEvent) => {
      const arc = findArc(e.features?.[0]?.id as string | number | undefined)
      if (!arc) {
        return
      }

      latestRef.current.onClick?.({
        arc: arc as T,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        originalEvent: e,
      })
    }

    map.on("mousemove", hitLayerId, handleMouseMove)
    map.on("mouseleave", hitLayerId, handleMouseLeave)
    map.on("click", hitLayerId, handleClick)

    return () => {
      map.off("mousemove", hitLayerId, handleMouseMove)
      map.off("mouseleave", hitLayerId, handleMouseLeave)
      map.off("click", hitLayerId, handleClick)
      setHover(null)
      map.getCanvas().style.cursor = ""
    }
  }, [isLoaded, map, hitLayerId, sourceId, interactive])

  return null
}
