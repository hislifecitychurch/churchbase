"use client"

import "maplibre-gl/dist/maplibre-gl.css"

import * as React from "react"
import MapLibreGL from "maplibre-gl"

import { cn } from "@packages/ui-w/lib/utils"
import { defaultMapStyles } from "@packages/ui-w/helpers/map/default-map-styles"
import { getMapViewport } from "@packages/ui-w/helpers/map/get-map-viewport"
import { useResolvedTheme } from "@packages/ui-w/hooks/use-resolved-theme"
import { MapContext } from "@packages/ui-w/contexts/map-context"
import type { MapProps, MapStyleOption } from "@packages/ui-w/types/map"

import { MapLoader } from "@packages/ui-w/shared/map/map-loader"

export function Map({
  children,
  className,
  ref,
  theme: themeProp,
  styles,
  projection,
  viewport,
  onViewportChange,
  loading = false,
  ...props
}: MapProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = React.useState<MapLibreGL.Map | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = React.useState(false)
  const currentStyleRef = React.useRef<MapStyleOption | null>(null)
  const styleTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const internalUpdateRef = React.useRef(false)
  const resolvedTheme = useResolvedTheme(themeProp)

  const isControlled = viewport !== undefined && onViewportChange !== undefined

  const onViewportChangeRef = React.useRef(onViewportChange)
  onViewportChangeRef.current = onViewportChange

  const mapStyles = React.useMemo(
    () => ({
      dark: styles?.dark ?? defaultMapStyles.dark,
      light: styles?.light ?? defaultMapStyles.light,
    }),
    [styles],
  )

  React.useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [mapInstance])

  const clearStyleTimeout = React.useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current)
      styleTimeoutRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const initialStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light
    currentStyleRef.current = initialStyle

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: {
        compact: true,
      },
      ...props,
      ...viewport,
    })

    const styleDataHandler = () => {
      clearStyleTimeout()
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true)
        if (projection) {
          map.setProjection(projection)
        }
      }, 100)
    }
    const loadHandler = () => setIsLoaded(true)

    const handleMove = () => {
      if (internalUpdateRef.current) {
        return
      }

      onViewportChangeRef.current?.(getMapViewport(map))
    }

    map.on("load", loadHandler)
    map.on("styledata", styleDataHandler)
    map.on("move", handleMove)
    setMapInstance(map)

    return () => {
      clearStyleTimeout()
      map.off("load", loadHandler)
      map.off("styledata", styleDataHandler)
      map.off("move", handleMove)
      map.remove()
      setIsLoaded(false)
      setIsStyleLoaded(false)
      setMapInstance(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) {
      return
    }
    if (mapInstance.isMoving()) {
      return
    }

    const current = getMapViewport(mapInstance)
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    }

    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    ) {
      return
    }

    internalUpdateRef.current = true
    mapInstance.jumpTo(next)
    internalUpdateRef.current = false
  }, [mapInstance, isControlled, viewport])

  React.useEffect(() => {
    if (!mapInstance || !resolvedTheme) {
      return
    }

    const newStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light

    if (currentStyleRef.current === newStyle) {
      return
    }

    clearStyleTimeout()
    currentStyleRef.current = newStyle
    setIsStyleLoaded(false)

    mapInstance.setStyle(newStyle, { diff: true })
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout])

  const contextValue = React.useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded],
  )

  return (
    <MapContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn("relative h-full w-full", className)}>
        {(!isLoaded || loading) && <MapLoader />}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  )
}
