"use client"

import { useEffect, useRef } from "react"

import { cn } from "@packages/ui-w/lib/utils"

export type Shape = "wave" | "noise" | "ripple" | "swirl" | "plasma" | "scan"
export type Matrix = "random" | "bayer2" | "bayer4" | "bayer8"
export type CursorMode = "ripple" | "erase" | "burn"

type CursorState = {
  x: number
  y: number
  active: boolean
  mode: CursorMode
}

type ShaderPixelGridState = {
  shape: Shape
  matrix: Matrix
  pxSize: number
  amplitude: number
  frequency: number
  speed: number
  rings: number
  colorFg: string
  cursorSize: number
  cursorScale: number
  cursor: CursorState
}

export interface ShaderPixelGridProps {
  shape?: Shape
  matrix?: Matrix
  pxSize?: number
  amplitude?: number
  frequency?: number
  speed?: number
  rings?: number
  colorFg?: string
  cursorMode?: CursorMode
  cursorSize?: number
  cursorScale?: number
  className?: string
}

const BAYER_2 = [0, 2, 3, 1]
const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const BAYER_8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
]

function getBayerValue(x: number, y: number, matrix: Matrix) {
  if (matrix === "random") return Math.random()
  if (matrix === "bayer2") return BAYER_2[(y % 2) * 2 + (x % 2)]! / 4
  if (matrix === "bayer4") return BAYER_4[(y % 4) * 4 + (x % 4)]! / 16
  return BAYER_8[(y % 8) * 8 + (x % 8)]! / 64
}

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function smoothNoise(x: number, y: number) {
  const gridX = Math.floor(x)
  const gridY = Math.floor(y)
  const fractX = x - gridX
  const fractY = y - gridY
  const blendX = fractX * fractX * (3 - 2 * fractX)
  const blendY = fractY * fractY * (3 - 2 * fractY)

  return (
    hash(gridX, gridY) * (1 - blendX) * (1 - blendY) +
    hash(gridX + 1, gridY) * blendX * (1 - blendY) +
    hash(gridX, gridY + 1) * (1 - blendX) * blendY +
    hash(gridX + 1, gridY + 1) * blendX * blendY
  )
}

function fractalBrownianMotion(x: number, y: number) {
  return (
    0.5 * smoothNoise(x, y) + 0.35 * smoothNoise(2 * x, 2 * y) + 0.15 * smoothNoise(4 * x, 4 * y)
  )
}

function smoothstep(min: number, max: number, value: number) {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return normalized * normalized * (3 - 2 * normalized)
}

function fract(value: number) {
  return value - Math.floor(value)
}

function evaluateShape(x: number, y: number, time: number, state: ShaderPixelGridState) {
  const { amplitude, cursor, frequency, rings, shape } = state
  const pi = Math.PI
  const twoPi = 2 * pi
  let signal = 0

  if (shape === "wave") {
    const wave =
      Math.cos(frequency * 10 * x - 2 * time) * Math.sin(frequency * 6 * x + time) * amplitude
    const boundary = y * 2 + wave
    signal = 1 - (Math.tanh(boundary * 4) * 0.5 + 0.5)
  } else if (shape === "noise") {
    const noise = fractalBrownianMotion(x * frequency * 8 - time, y * frequency * 8 + time)
    signal = 0.5 + amplitude * (noise - 0.5) * 10
    signal = smoothstep(0.5, 2, signal)
  } else if (shape === "ripple") {
    const distance = Math.sqrt(x * x + y * y)
    const ripple =
      Math.sin(Math.pow(distance * 2, 2 + amplitude * 0.7) * rings * pi - frequency * time) * 0.5 +
      0.2
    signal = ripple * smoothstep(0.5, 2, distance)
  } else if (shape === "swirl") {
    const distance = Math.sqrt(x * x + y * y)
    const angle = rings * Math.atan2(y, x) + frequency * time
    const twist = Math.max(amplitude, 0.5)
    const offset = Math.pow(Math.max(distance, 1e-6), -twist) + angle / twoPi
    signal = fract(offset) * smoothstep(1.5, 0.1, distance)
  } else if (shape === "plasma") {
    const scaledX = x * frequency * 50
    const scaledY = y * frequency * 50
    signal =
      Math.sin(scaledX + time) +
      Math.sin(scaledY + time * 0.07) +
      Math.sin((scaledX + scaledY) * 0.5 + time * 0.5) +
      Math.sin(Math.sqrt(scaledX * scaledX + scaledY * scaledY + 1) * 1.5 + time * 0.9) +
      0.05
    signal = 0.5 + (signal - 6) * amplitude
  } else if (shape === "scan") {
    const scanline = Math.sin(y * rings * pi * 3 - frequency * time) * 0.5 + 0.5
    const fade = 1 - Math.abs(x) * 0.5
    signal = scanline * Math.max(0, fade) * amplitude
  }

  if (cursor.active) {
    const dx = x - cursor.x
    const dy = y - cursor.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const scaledDistance = distance / state.cursorSize
    const ripple =
      Math.sin(scaledDistance * 30 * state.cursorScale - time * 6 * state.cursorScale) * 0.5 + 0.5
    const falloff = smoothstep(1, 0, scaledDistance)

    if (cursor.mode === "ripple") signal = Math.min(1, signal + ripple * falloff * 0.8)
    else if (cursor.mode === "erase") signal *= 1 - falloff * 0.95
    else if (cursor.mode === "burn") signal = Math.min(1, signal + falloff * 0.9)
  }

  return Math.max(0, Math.min(1, signal))
}

export function ShaderPixelGrid({
  shape = "wave",
  matrix = "bayer8",
  pxSize = 2,
  amplitude = 0.15,
  frequency = 0.7,
  speed = 0.3,
  rings = 3,
  colorFg = "#0000ff",
  cursorMode = "burn",
  cursorSize = 0.3,
  cursorScale = 0.2,
  className,
}: ShaderPixelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const startTimeRef = useRef(performance.now())
  const stateRef = useRef<ShaderPixelGridState>({
    shape,
    matrix,
    pxSize,
    amplitude,
    frequency,
    speed,
    rings,
    colorFg,
    cursorSize,
    cursorScale,
    cursor: { x: -1, y: -1, active: false, mode: cursorMode },
  })

  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      shape,
      matrix,
      pxSize,
      amplitude,
      frequency,
      speed,
      rings,
      colorFg,
      cursorSize,
      cursorScale,
      cursor: { ...stateRef.current.cursor, mode: cursorMode },
    }
  }, [
    amplitude,
    colorFg,
    cursorMode,
    cursorScale,
    cursorSize,
    frequency,
    matrix,
    pxSize,
    rings,
    shape,
    speed,
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const context = canvas.getContext("2d")
    if (!context) return

    const colorProbe = document.createElement("span")
    colorProbe.style.color = "#0000ff"
    colorProbe.style.display = "none"
    container.appendChild(colorProbe)

    let devicePixelRatioValue = 1
    let lastColorFg = ""
    let resolvedColorFg = "#0000ff"

    const invalidateResolvedColors = () => {
      lastColorFg = ""
    }

    const resize = () => {
      devicePixelRatioValue = window.devicePixelRatio || 1
      const width = container.clientWidth
      const height = container.clientHeight
      canvas.width = Math.round(width * devicePixelRatioValue)
      canvas.height = Math.round(height * devicePixelRatioValue)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    const resolveColorFg = (color: string) => {
      if (color === lastColorFg) return resolvedColorFg

      colorProbe.style.color = "#0000ff"
      colorProbe.style.color = color
      resolvedColorFg = getComputedStyle(colorProbe).color
      lastColorFg = color

      return resolvedColorFg
    }

    const render = () => {
      const state = stateRef.current
      const elapsed = ((performance.now() - startTimeRef.current) / 1000) * state.speed
      const pixelSize = Math.max(1, Math.floor(state.pxSize * devicePixelRatioValue))
      const columns = Math.ceil(canvas.width / pixelSize)
      const rows = Math.ceil(canvas.height / pixelSize)
      const aspectRatio = canvas.width / canvas.height

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = resolveColorFg(state.colorFg)

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          let x = column / columns - 0.5
          let y = row / rows - 0.5

          if (aspectRatio > 1) x *= aspectRatio
          else y /= aspectRatio

          const signal = evaluateShape(x, y, elapsed, state)
          const threshold = getBayerValue(column, row, state.matrix)

          if (signal > threshold) {
            context.fillRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize)
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const colorObserver = new MutationObserver(invalidateResolvedColors)
    const colorObserverOptions = { attributeFilter: ["class", "style"] }
    colorObserver.observe(document.documentElement, colorObserverOptions)
    colorObserver.observe(document.body, colorObserverOptions)
    colorObserver.observe(container, colorObserverOptions)
    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      resizeObserver.disconnect()
      colorObserver.disconnect()
      colorProbe.remove()
    }
  }, [])

  const updateCursor = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const aspectRatio = canvas.width / canvas.height
    let nextX = x
    let nextY = y

    if (aspectRatio > 1) nextX *= aspectRatio
    else nextY /= aspectRatio

    stateRef.current.cursor.x = nextX
    stateRef.current.cursor.y = nextY
    stateRef.current.cursor.active = true
  }

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full bg-transparent"
        onMouseLeave={() => {
          stateRef.current.cursor.active = false
        }}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          updateCursor(
            (event.clientX - rect.left) / rect.width - 0.5,
            (event.clientY - rect.top) / rect.height - 0.5,
          )
        }}
      />
    </div>
  )
}
