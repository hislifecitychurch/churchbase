"use client"

import * as React from "react"
import type MapLibreGL from "maplibre-gl"
import type { Feature, GeoJsonProperties, Point } from "geojson"

import { useMap } from "@packages/ui-w/hooks/use-map"
import type { MapClusterLayerProps } from "@packages/ui-w/types/map"

export function MapClusterLayer<P extends GeoJsonProperties = GeoJsonProperties>({
  data,
  clusterMaxZoom = 14,
  clusterRadius = 50,
  clusterColors = ["#22c55e", "#eab308", "#ef4444"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>): null {
  const { map, isLoaded } = useMap()
  const id = React.useId()
  const sourceId = `cluster-source-${id}`
  const clusterLayerId = `clusters-${id}`
  const clusterCountLayerId = `cluster-count-${id}`
  const unclusteredLayerId = `unclustered-point-${id}`

  const stylePropsRef = React.useRef({
    clusterColors,
    clusterThresholds,
    pointColor,
  })

  React.useEffect(() => {
    if (!isLoaded || !map) {
      return
    }

    map.addSource(sourceId, {
      type: "geojson",
      data,
      cluster: true,
      clusterMaxZoom,
      clusterRadius,
    })

    map.addLayer({
      id: clusterLayerId,
      type: "circle",
      source: sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          clusterColors[0],
          clusterThresholds[0],
          clusterColors[1],
          clusterThresholds[1],
          clusterColors[2],
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          clusterThresholds[0],
          30,
          clusterThresholds[1],
          40,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": 0.85,
      },
    })

    map.addLayer({
      id: clusterCountLayerId,
      type: "symbol",
      source: sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Open Sans"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    })

    map.addLayer({
      id: unclusteredLayerId,
      type: "circle",
      source: sourceId,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": pointColor,
        "circle-radius": 5,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    })

    return () => {
      try {
        if (map.getLayer(clusterCountLayerId)) {
          map.removeLayer(clusterCountLayerId)
        }
        if (map.getLayer(unclusteredLayerId)) {
          map.removeLayer(unclusteredLayerId)
        }
        if (map.getLayer(clusterLayerId)) {
          map.removeLayer(clusterLayerId)
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId)
        }
      } catch {
        // Ignore MapLibre cleanup races during style changes.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map, sourceId])

  React.useEffect(() => {
    if (!isLoaded || !map || typeof data === "string") {
      return
    }

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource
    source?.setData(data)
  }, [isLoaded, map, data, sourceId])

  React.useEffect(() => {
    if (!isLoaded || !map) {
      return
    }

    const prev = stylePropsRef.current
    const colorsChanged =
      prev.clusterColors !== clusterColors || prev.clusterThresholds !== clusterThresholds

    if (map.getLayer(clusterLayerId) && colorsChanged) {
      map.setPaintProperty(clusterLayerId, "circle-color", [
        "step",
        ["get", "point_count"],
        clusterColors[0],
        clusterThresholds[0],
        clusterColors[1],
        clusterThresholds[1],
        clusterColors[2],
      ])
      map.setPaintProperty(clusterLayerId, "circle-radius", [
        "step",
        ["get", "point_count"],
        20,
        clusterThresholds[0],
        30,
        clusterThresholds[1],
        40,
      ])
    }

    if (map.getLayer(unclusteredLayerId) && prev.pointColor !== pointColor) {
      map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor)
    }

    stylePropsRef.current = { clusterColors, clusterThresholds, pointColor }
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    clusterColors,
    clusterThresholds,
    pointColor,
  ])

  React.useEffect(() => {
    if (!isLoaded || !map) {
      return
    }

    const handleClusterClick = async (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[]
      },
    ) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId],
      })
      if (!features.length) {
        return
      }

      const feature = features[0]
      if (!feature) {
        return
      }

      const clusterId = feature.properties?.cluster_id as number
      const pointCount = feature.properties?.point_count as number
      const coordinates = (feature.geometry as Point).coordinates as [number, number]

      if (onClusterClick) {
        onClusterClick(clusterId, coordinates, pointCount)
      } else {
        const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource
        const zoom = await source.getClusterExpansionZoom(clusterId)
        map.easeTo({
          center: coordinates,
          zoom,
        })
      }
    }

    const handlePointClick = (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[]
      },
    ) => {
      if (!onPointClick || !e.features?.length) {
        return
      }

      const feature = e.features[0]
      if (!feature) {
        return
      }

      const coordinates = (feature.geometry as Point).coordinates.slice() as [number, number]

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      onPointClick(feature as unknown as Feature<Point, P>, coordinates)
    }

    const handleMouseEnterCluster = () => {
      map.getCanvas().style.cursor = "pointer"
    }
    const handleMouseLeaveCluster = () => {
      map.getCanvas().style.cursor = ""
    }
    const handleMouseEnterPoint = () => {
      if (onPointClick) {
        map.getCanvas().style.cursor = "pointer"
      }
    }
    const handleMouseLeavePoint = () => {
      map.getCanvas().style.cursor = ""
    }

    map.on("click", clusterLayerId, handleClusterClick)
    map.on("click", unclusteredLayerId, handlePointClick)
    map.on("mouseenter", clusterLayerId, handleMouseEnterCluster)
    map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster)
    map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint)
    map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint)

    return () => {
      map.off("click", clusterLayerId, handleClusterClick)
      map.off("click", unclusteredLayerId, handlePointClick)
      map.off("mouseenter", clusterLayerId, handleMouseEnterCluster)
      map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster)
      map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint)
      map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint)
    }
  }, [isLoaded, map, clusterLayerId, unclusteredLayerId, sourceId, onClusterClick, onPointClick])

  return null
}
