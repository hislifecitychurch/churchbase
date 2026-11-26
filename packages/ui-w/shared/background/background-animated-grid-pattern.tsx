"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef } from "react"
import type * as React from "react"
import { motion } from "motion/react"

import { cn } from "@packages/ui-w/lib/utils"

export interface BackgroundAnimatedGridPatternProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "color" | "height" | "strokeDasharray" | "width" | "x" | "y"
> {
  color?: string
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

type Square = {
  id: number
  pos: [number, number]
  iteration: number
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  return Number.isFinite(value) ? Math.min(Math.max(value, min), max) : fallback
}

function getDimension(value: number | undefined, fallback: number): number {
  const dimension = value ?? fallback

  return Number.isFinite(dimension) ? Math.max(1, Math.floor(dimension)) : fallback
}

export function BackgroundAnimatedGridPattern({
  width: widthProp = 40,
  height: heightProp = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares: numSquaresProp = 50,
  className,
  color,
  maxOpacity: maxOpacityProp = 0.5,
  duration: durationProp = 4,
  repeatDelay: repeatDelayProp = 0.5,
  ...props
}: BackgroundAnimatedGridPatternProps): React.ReactElement {
  const id = useId().replace(/:/g, "")
  const containerRef = useRef<SVGSVGElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [squares, setSquares] = useState<Array<Square>>([])
  const width = getDimension(widthProp, 40)
  const height = getDimension(heightProp, 40)
  const numSquares = Number.isFinite(numSquaresProp) ? Math.max(0, Math.floor(numSquaresProp)) : 50
  const maxOpacity = clamp(maxOpacityProp, 0, 1, 0.5)
  const duration = clamp(durationProp, 0, Number.POSITIVE_INFINITY, 4)
  const repeatDelay = clamp(repeatDelayProp, 0, Number.POSITIVE_INFINITY, 0.5)

  const getPos = useCallback((): [number, number] => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ]
  }, [dimensions.height, dimensions.width, height, width])

  const generateSquares = useCallback(
    (count: number): Array<Square> => {
      return Array.from({ length: count }, (_, index) => ({
        id: index,
        pos: getPos(),
        iteration: 0,
      }))
    },
    [getPos],
  )

  const updateSquarePosition = useCallback(
    (squareId: number): void => {
      setSquares((currentSquares) => {
        const current = currentSquares[squareId]
        if (!current || current.id !== squareId) return currentSquares

        const nextSquares = currentSquares.slice()
        nextSquares[squareId] = {
          ...current,
          pos: getPos(),
          iteration: current.iteration + 1,
        }

        return nextSquares
      })
    },
    [getPos],
  )

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setSquares(generateSquares(numSquares))
    } else {
      setSquares([])
    }
  }, [dimensions.height, dimensions.width, generateSquares, numSquares])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.max(0, Math.floor(entry?.contentRect.width ?? 0))
      const nextHeight = Math.max(0, Math.floor(entry?.contentRect.height ?? 0))

      setDimensions((currentDimensions) => {
        if (currentDimensions.width === nextWidth && currentDimensions.height === nextHeight) {
          return currentDimensions
        }

        return { height: nextHeight, width: nextWidth }
      })
    })

    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <svg
      {...props}
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-gray-400/30",
        className,
      )}
      color={color}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            stroke="currentColor"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [squareX, squareY], id: squareId, iteration }, index) => (
          <motion.rect
            key={`${squareId}-${iteration}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
              repeatDelay,
            }}
            onAnimationComplete={() => updateSquarePosition(squareId)}
            width={width - 1}
            height={height - 1}
            x={squareX * width + 1}
            y={squareY * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  )
}
