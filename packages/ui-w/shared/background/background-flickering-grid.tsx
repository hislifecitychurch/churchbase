"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps } from "react"
import type * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export interface BackgroundFlickeringGridProps extends ComponentProps<"div"> {
  color?: string
  flickerChance?: number
  gridGap?: number
  height?: number
  maxOpacity?: number
  squareSize?: number
  width?: number
}

interface GridState {
  cols: number
  rows: number
  squares: Float32Array
  width: number
  height: number
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  return Number.isFinite(value) ? Math.min(Math.max(value, min), max) : fallback
}

function getDimension(value: number | undefined, fallback: number): number {
  const dimension = value ?? fallback

  return Number.isFinite(dimension) ? Math.max(0, Math.floor(dimension)) : 0
}

function resolveColor(container: HTMLElement, color: string): string {
  const probe = document.createElement("span")
  probe.style.color = color
  probe.style.display = "none"
  container.appendChild(probe)

  const resolvedColor = getComputedStyle(probe).color || getComputedStyle(container).color
  probe.remove()

  return resolvedColor || "rgb(0 0 0)"
}

export function BackgroundFlickeringGrid({
  className,
  color = "rgb(0 0 0)",
  flickerChance = 0.3,
  gridGap = 6,
  height,
  maxOpacity = 0.3,
  squareSize = 4,
  width,
  ...props
}: BackgroundFlickeringGridProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const context = canvas?.getContext("2d")

    if (!canvas || !container || !context) return

    const dotSize = clamp(squareSize, 1, Number.POSITIVE_INFINITY, 4)
    const gap = clamp(gridGap, 0, Number.POSITIVE_INFINITY, 6)
    const maxSquareOpacity = clamp(maxOpacity, 0, 1, 0.3)
    const flickerRate = clamp(flickerChance, 0, Number.POSITIVE_INFINITY, 0.3)
    const step = dotSize + gap
    const devicePixelRatio = window.devicePixelRatio || 1
    let currentColor = resolveColor(container, color)
    let grid: GridState | null = null
    let widthInPixels = -1
    let heightInPixels = -1
    let animationFrameId: number | null = null
    let isVisible = false
    let lastTime = 0

    const drawGrid = (nextGrid: GridState): void => {
      context.clearRect(0, 0, nextGrid.width, nextGrid.height)
      context.fillStyle = currentColor

      for (let column = 0; column < nextGrid.cols; column++) {
        for (let row = 0; row < nextGrid.rows; row++) {
          context.globalAlpha = nextGrid.squares[column * nextGrid.rows + row] ?? 0
          const x = Math.min(column * step, Math.max(0, nextGrid.width - dotSize))
          const y = Math.min(row * step, Math.max(0, nextGrid.height - dotSize))
          context.fillRect(x, y, dotSize, dotSize)
        }
      }

      context.globalAlpha = 1
    }

    const resizeCanvas = (): void => {
      const nextWidth = getDimension(width, container.clientWidth)
      const nextHeight = getDimension(height, container.clientHeight)

      if (nextWidth === widthInPixels && nextHeight === heightInPixels) return

      widthInPixels = nextWidth
      heightInPixels = nextHeight

      canvas.width = Math.floor(nextWidth * devicePixelRatio)
      canvas.height = Math.floor(nextHeight * devicePixelRatio)
      canvas.style.width = `${nextWidth}px`
      canvas.style.height = `${nextHeight}px`
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

      if (nextWidth === 0 || nextHeight === 0) {
        grid = null
        return
      }

      const cols = Math.max(1, Math.ceil((nextWidth - dotSize) / step) + 1)
      const rows = Math.max(1, Math.ceil((nextHeight - dotSize) / step) + 1)
      const squares = new Float32Array(cols * rows)

      for (let index = 0; index < squares.length; index++) {
        squares[index] = Math.random() * maxSquareOpacity
      }

      grid = { cols, height: nextHeight, rows, squares, width: nextWidth }
      drawGrid(grid)
    }

    const stopAnimation = (): void => {
      isVisible = false

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    const animate = (time: number): void => {
      if (!isVisible || !grid) {
        animationFrameId = null
        return
      }

      const deltaTime = Math.min(Math.max((time - lastTime) / 1000, 0), 0.1)
      const updateChance = Math.min(1, flickerRate * deltaTime)
      lastTime = time

      for (let index = 0; index < grid.squares.length; index++) {
        if (Math.random() < updateChance) {
          grid.squares[index] = Math.random() * maxSquareOpacity
        }
      }

      drawGrid(grid)
      animationFrameId = requestAnimationFrame(animate)
    }

    const startAnimation = (): void => {
      isVisible = true

      if (animationFrameId === null) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(container)
    resizeCanvas()

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) startAnimation()
        else stopAnimation()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(container)

    const colorObserver = new MutationObserver(() => {
      currentColor = resolveColor(container, color)
      if (grid) drawGrid(grid)
    })
    colorObserver.observe(document.documentElement, {
      attributeFilter: ["class", "style"],
      attributes: true,
    })

    return () => {
      stopAnimation()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      colorObserver.disconnect()
    }
  }, [color, flickerChance, gridGap, height, maxOpacity, squareSize, width])

  return (
    <div
      {...props}
      ref={containerRef}
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <canvas ref={canvasRef} className="pointer-events-none block size-full" />
    </div>
  )
}
