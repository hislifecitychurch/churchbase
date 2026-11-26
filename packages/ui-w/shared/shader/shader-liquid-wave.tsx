"use client"

import { useEffect, useRef } from "react"

import { cn } from "@packages/ui-w/lib/utils"

type RGBA = readonly [number, number, number, number]
export type ShaderLiquidWavePattern = "bayer4" | "bayer8"
export type ShaderLiquidWaveAccentMode = "blend" | "hard" | "pattern"

export interface ShaderLiquidWaveProps {
  width?: number
  height?: number
  fg?: string
  bg?: string
  ac?: string
  pixelSize?: number
  threshold?: number
  spread?: number
  acMix?: number
  acMode?: ShaderLiquidWaveAccentMode
  patternType?: ShaderLiquidWavePattern
  speed?: number
  intensity?: number
  scale?: number
  className?: string
  style?: React.CSSProperties
}

type ShaderLiquidWaveResolvedState = {
  fg: RGBA
  bg: RGBA
  ac: RGBA
  pixelSize: number
  threshold: number
  spread: number
  acMix: number
  acMode: ShaderLiquidWaveAccentMode
  speed: number
  intensity: number
  scale: number
}

type ShaderLiquidWaveInputState = {
  fg: string
  bg: string
  ac: string
  pixelSize: number
  threshold: number
  spread: number
  acMix: number
  acMode: ShaderLiquidWaveAccentMode
  speed: number
  intensity: number
  scale: number
}

const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5] as const
const BAYER_8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
] as const
const TRANSPARENT: RGBA = [0, 0, 0, 0]

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function normalizeInputState(input: ShaderLiquidWaveInputState) {
  return {
    ...input,
    pixelSize: Math.max(1, Math.floor(input.pixelSize)),
    threshold: clamp01(input.threshold),
    spread: clamp01(input.spread),
    acMix: clamp01(input.acMix),
  } satisfies ShaderLiquidWaveInputState
}

function readCanvasColor(context: CanvasRenderingContext2D, value: string) {
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = "rgba(0, 0, 0, 0)"
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)

  const pixel = context.getImageData(0, 0, 1, 1).data
  return [pixel[0]!, pixel[1]!, pixel[2]!, pixel[3]!] as const
}

function resolveColor(probe: HTMLSpanElement, colorCanvas: HTMLCanvasElement, color: string) {
  if (!color || color === "transparent") return TRANSPARENT

  probe.style.color = "transparent"
  probe.style.color = color

  const context = colorCanvas.getContext("2d", { willReadFrequently: true })
  if (!context) return TRANSPARENT

  return readCanvasColor(context, getComputedStyle(probe).color)
}

function resolveState(
  input: ShaderLiquidWaveInputState,
  probe: HTMLSpanElement,
  colorCanvas: HTMLCanvasElement,
) {
  const normalized = normalizeInputState(input)

  return {
    fg: resolveColor(probe, colorCanvas, normalized.fg),
    bg: resolveColor(probe, colorCanvas, normalized.bg),
    ac: resolveColor(probe, colorCanvas, normalized.ac),
    pixelSize: normalized.pixelSize,
    threshold: normalized.threshold,
    spread: normalized.spread,
    acMix: normalized.acMix,
    acMode: normalized.acMode,
    speed: normalized.speed,
    intensity: normalized.intensity,
    scale: normalized.scale,
  } satisfies ShaderLiquidWaveResolvedState
}

function getPatternValue(x: number, y: number, patternType: ShaderLiquidWavePattern) {
  if (patternType === "bayer8") return BAYER_8[(y & 7) * 8 + (x & 7)]! / 64
  return BAYER_4[(y & 3) * 4 + (x & 3)]! / 16
}

export function ShaderLiquidWave({
  width = 800,
  height = 800,
  fg = "#ff0000",
  bg = "transparent",
  ac = "#00ffaa",
  pixelSize = 2,
  threshold = 128 / 255,
  spread = 0.5,
  acMix = 0,
  acMode = "blend",
  patternType = "bayer4",
  speed = 0.9,
  intensity = 76,
  scale = 7,
  className,
  style,
}: ShaderLiquidWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const colorProbeRef = useRef<HTMLSpanElement | null>(null)
  const colorCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const inputStateRef = useRef<ShaderLiquidWaveInputState>({
    fg,
    bg,
    ac,
    pixelSize,
    threshold,
    spread,
    acMix,
    acMode,
    speed,
    intensity,
    scale,
  })
  const resolvedStateRef = useRef<ShaderLiquidWaveResolvedState>({
    fg: TRANSPARENT,
    bg: TRANSPARENT,
    ac: TRANSPARENT,
    pixelSize: Math.max(1, Math.floor(pixelSize)),
    threshold: clamp01(threshold),
    spread: clamp01(spread),
    acMix: clamp01(acMix),
    acMode,
    speed,
    intensity,
    scale,
  })

  useEffect(() => {
    inputStateRef.current = {
      fg,
      bg,
      ac,
      pixelSize,
      threshold,
      spread,
      acMix,
      acMode,
      speed,
      intensity,
      scale,
    }

    const probe = colorProbeRef.current
    const colorCanvas = colorCanvasRef.current

    if (!probe || !colorCanvas) return

    resolvedStateRef.current = resolveState(inputStateRef.current, probe, colorCanvas)
  }, [ac, acMix, acMode, bg, fg, intensity, pixelSize, scale, speed, spread, threshold])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const probe = document.createElement("span")
    probe.style.display = "none"
    probe.style.color = "transparent"
    colorProbeRef.current = probe
    ;(canvas.parentElement ?? document.body).appendChild(probe)

    const colorCanvas = document.createElement("canvas")
    colorCanvas.width = 1
    colorCanvas.height = 1
    colorCanvasRef.current = colorCanvas

    const syncResolvedState = () => {
      resolvedStateRef.current = resolveState(inputStateRef.current, probe, colorCanvas)
    }

    syncResolvedState()

    const colorObserver = new MutationObserver(syncResolvedState)
    const observerOptions = { attributeFilter: ["class", "style"] }
    colorObserver.observe(document.documentElement, observerOptions)
    colorObserver.observe(document.body, observerOptions)
    if (canvas.parentElement) colorObserver.observe(canvas.parentElement, observerOptions)

    const safeWidth = Math.max(1, Math.floor(width))
    const safeHeight = Math.max(1, Math.floor(height))
    const signalBuffer = new Float32Array(safeWidth * safeHeight)
    const image = context.createImageData(safeWidth, safeHeight)
    const data = image.data
    let time = 0

    const draw = () => {
      const state = resolvedStateRef.current
      const amplitude = state.intensity / 50
      const halfZone = state.acMix * 0.45
      const accentLow = 0.5 - halfZone
      const accentHigh = 0.5 + halfZone

      time += 0.016 * state.speed

      for (let y = 0; y < safeHeight; y++) {
        for (let x = 0; x < safeWidth; x++) {
          const normalizedX = (x / safeWidth) * state.scale
          const normalizedY = (y / safeHeight) * state.scale
          const wave1 =
            Math.sin(normalizedX * 3 + time * 1.5) * Math.cos(normalizedY * 2 - time * 0.7)
          const wave2 = Math.sin((normalizedX + normalizedY) * 2 - time * 1.2) * 0.5
          const wave3 = Math.cos(normalizedX * 1.5 - normalizedY * 3 + time * 0.8) * 0.3

          signalBuffer[y * safeWidth + x] = clamp01((wave1 + wave2 + wave3) * amplitude * 0.4 + 0.5)
        }
      }

      for (let y = 0; y < safeHeight; y++) {
        for (let x = 0; x < safeWidth; x++) {
          const index = y * safeWidth + x
          const signal = signalBuffer[index]!
          const quantizedX = Math.floor(x / state.pixelSize)
          const quantizedY = Math.floor(y / state.pixelSize)
          const patternValue = getPatternValue(quantizedX, quantizedY, patternType)
          const isForeground = signal + (patternValue - 0.5) * state.spread > state.threshold

          let r: number
          let g: number
          let b: number
          let a: number

          if (state.acMix > 0.01 && signal >= accentLow && signal <= accentHigh) {
            if (state.acMode === "hard") {
              ;[r, g, b, a] = state.ac
            } else if (state.acMode === "pattern") {
              ;[r, g, b, a] = isForeground ? state.ac : state.bg
            } else {
              const source = isForeground ? state.fg : state.bg
              const blend = halfZone > 0 ? (1 - Math.abs(signal - 0.5) / halfZone) ** 2 : 1
              r = source[0] + (state.ac[0] - source[0]) * blend
              g = source[1] + (state.ac[1] - source[1]) * blend
              b = source[2] + (state.ac[2] - source[2]) * blend
              a = source[3] + (state.ac[3] - source[3]) * blend
            }
          } else {
            ;[r, g, b, a] = isForeground ? state.fg : state.bg
          }

          const offset = index * 4
          data[offset] = r
          data[offset + 1] = g
          data[offset + 2] = b
          data[offset + 3] = a
        }
      }

      context.putImageData(image, 0, 0)
      animationFrameRef.current = window.requestAnimationFrame(draw)
    }

    animationFrameRef.current = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current)
      colorObserver.disconnect()
      colorProbeRef.current = null
      colorCanvasRef.current = null
      probe.remove()
    }
  }, [height, patternType, width])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("block h-full w-full bg-transparent [image-rendering:pixelated]", className)}
      style={style}
    />
  )
}
