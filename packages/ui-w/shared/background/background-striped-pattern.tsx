import { useId } from "react"
import type { SVGProps } from "react"

import { cn } from "@packages/ui-w/lib/utils"

export interface BackgroundStripedPatternProps extends SVGProps<SVGSVGElement> {
  direction?: "left" | "right"
}

export function BackgroundStripedPattern({
  direction = "left",
  className,
  width = 10,
  height = 10,
  stroke = "currentColor",
  strokeWidth = 0.5,
  ...props
}: BackgroundStripedPatternProps) {
  const id = useId()
  const w = Number(width)
  const h = Number(height)

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 h-full w-full opacity-15",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...props}
    >
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {direction === "left" ? (
            <>
              <line x1="0" y1={h} x2={w} y2="0" />
              <line x1={-w} y1={h} x2="0" y2="0" />
              <line x1={w} y1={h} x2={w * 2} y2="0" />
            </>
          ) : (
            <>
              <line x1="0" y1="0" x2={w} y2={h} />
              <line x1={-w} y1="0" x2="0" y2={h} />
              <line x1={w} y1="0" x2={w * 2} y2={h} />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
