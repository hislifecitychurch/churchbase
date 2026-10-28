import type MapLibreGL from "maplibre-gl"
import type { MarkerOptions, PopupOptions } from "maplibre-gl"
import type { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import type { ReactNode, Ref } from "react"

import type { Theme } from "@packages/ui-w/helpers/map/get-system-theme"

export type MapViewport = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

export type MapStyleOption = string | MapLibreGL.StyleSpecification

export type MapRef = MapLibreGL.Map

export type MapProps = {
  children?: ReactNode
  className?: string
  ref?: Ref<MapRef>
  theme?: Theme
  styles?: {
    light?: MapStyleOption
    dark?: MapStyleOption
  }
  projection?: MapLibreGL.ProjectionSpecification
  viewport?: Partial<MapViewport>
  onViewportChange?: (viewport: MapViewport) => void
  loading?: boolean
} & Omit<MapLibreGL.MapOptions, "container" | "style">

export type MapMarkerProps = {
  longitude: number
  latitude: number
  children: ReactNode
  onClick?: (e: MouseEvent) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  onDragStart?: (lngLat: { lng: number; lat: number }) => void
  onDrag?: (lngLat: { lng: number; lat: number }) => void
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void
} & Omit<MarkerOptions, "element">

export type MapMarkerContentProps = {
  children?: ReactNode
  className?: string
}

export type MapMarkerPopupProps = {
  children: ReactNode
  className?: string
  closeButton?: boolean
} & Omit<PopupOptions, "className" | "closeButton">

export type MapMarkerTooltipProps = {
  children: ReactNode
  className?: string
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">

export type MapMarkerLabelProps = {
  children: ReactNode
  className?: string
  position?: "top" | "bottom"
}

export type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showZoom?: boolean
  showCompass?: boolean
  showLocate?: boolean
  showFullscreen?: boolean
  className?: string
  onLocate?: (coords: { longitude: number; latitude: number }) => void
}

export type MapPopupProps = {
  longitude: number
  latitude: number
  onClose?: () => void
  children: ReactNode
  className?: string
  closeButton?: boolean
} & Omit<PopupOptions, "className" | "closeButton">

export type MapRouteProps = {
  id?: string
  coordinates: [number, number][]
  color?: string
  width?: number
  opacity?: number
  dashArray?: [number, number]
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  interactive?: boolean
}

export type MapArcDatum = {
  id: string | number
  from: [number, number]
  to: [number, number]
}

export type MapArcEvent<T extends MapArcDatum = MapArcDatum> = {
  arc: T
  longitude: number
  latitude: number
  originalEvent: MapLibreGL.MapMouseEvent
}

export type MapArcLinePaint = NonNullable<MapLibreGL.LineLayerSpecification["paint"]>
export type MapArcLineLayout = NonNullable<MapLibreGL.LineLayerSpecification["layout"]>

export type MapArcProps<T extends MapArcDatum = MapArcDatum> = {
  data: T[]
  id?: string
  curvature?: number
  samples?: number
  paint?: MapArcLinePaint
  layout?: MapArcLineLayout
  hoverPaint?: MapArcLinePaint
  onClick?: (e: MapArcEvent<T>) => void
  onHover?: (e: MapArcEvent<T> | null) => void
  interactive?: boolean
  beforeId?: string
}

export type MapClusterLayerProps<P extends GeoJsonProperties = GeoJsonProperties> = {
  data: string | FeatureCollection<Point, P>
  clusterMaxZoom?: number
  clusterRadius?: number
  clusterColors?: [string, string, string]
  clusterThresholds?: [number, number]
  pointColor?: string
  onPointClick?: (feature: Feature<Point, P>, coordinates: [number, number]) => void
  onClusterClick?: (clusterId: number, coordinates: [number, number], pointCount: number) => void
}
