import * as React from "react"

import { cn } from "@repo/ui-w/lib/utils"

export function SpinnerFlicker01({
  className,
  style,
  ...props
}: React.ComponentProps<"svg">): React.ReactElement {
  return (
    <svg
      aria-label="Loading"
      className={cn("spinner-flicker-01 size-4", className)}
      role="status"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={
        {
          "--on": "var(--spinner-flicker-foreground)",
          "--off": "var(--spinner-flicker-background)",
          "--dur": "1.200s",
          ...style,
        } as React.CSSProperties
      }
    >
      {/* Made with Flicker · flicker.laurie.fyi */}
      <title>Loading</title>
      <style>{String.raw`
        circle { fill: var(--off); }
        circle.on { fill: var(--on); }
        @media (prefers-reduced-motion: reduce) { circle { animation: none !important; } }
        @keyframes fs11110000 { 0% { opacity: 1; } 49.99% { opacity: 1; } 50.00% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs01110000 { 0% { opacity: 0; } 12.49% { opacity: 0; } 12.50% { opacity: 1; } 49.99% { opacity: 1; } 50.00% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs00111000 { 0% { opacity: 0; } 24.99% { opacity: 0; } 25.00% { opacity: 1; } 62.49% { opacity: 1; } 62.50% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs00011100 { 0% { opacity: 0; } 37.49% { opacity: 0; } 37.50% { opacity: 1; } 74.99% { opacity: 1; } 75.00% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs00011110 { 0% { opacity: 0; } 37.49% { opacity: 0; } 37.50% { opacity: 1; } 87.49% { opacity: 1; } 87.50% { opacity: 0; } 100% { opacity: 0; } }
      `}</style>
      <circle cx="3" cy="3" r="2" />
      <circle cx="9" cy="3" r="2" />
      <circle cx="15" cy="3" r="2" />
      <circle cx="21" cy="3" r="2" />
      <circle cx="27" cy="3" r="2" />
      <circle cx="3" cy="9" r="2" />
      <circle cx="9" cy="9" r="2" />
      <circle
        className="on"
        cx="9"
        cy="9"
        r="2"
        opacity={1}
        style={{ animation: "fs11110000 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="9" r="2" />
      <circle
        className="on"
        cx="15"
        cy="9"
        r="2"
        opacity={0}
        style={{ animation: "fs01110000 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="9" r="2" />
      <circle
        className="on"
        cx="21"
        cy="9"
        r="2"
        opacity={0}
        style={{ animation: "fs00111000 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="9" r="2" />
      <circle cx="3" cy="15" r="2" />
      <circle cx="9" cy="15" r="2" />
      <circle
        className="on"
        cx="9"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs01110000 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="15" r="2" />
      <circle
        className="on"
        cx="15"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs00111000 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="15" r="2" />
      <circle
        className="on"
        cx="21"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs00011100 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="15" r="2" />
      <circle cx="3" cy="21" r="2" />
      <circle cx="9" cy="21" r="2" />
      <circle
        className="on"
        cx="9"
        cy="21"
        r="2"
        opacity={0}
        style={{ animation: "fs00111000 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="21" r="2" />
      <circle
        className="on"
        cx="15"
        cy="21"
        r="2"
        opacity={0}
        style={{ animation: "fs00011100 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="21" r="2" />
      <circle
        className="on"
        cx="21"
        cy="21"
        r="2"
        opacity={0}
        style={{ animation: "fs00011110 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="21" r="2" />
      <circle cx="3" cy="27" r="2" />
      <circle cx="9" cy="27" r="2" />
      <circle cx="15" cy="27" r="2" />
      <circle cx="21" cy="27" r="2" />
      <circle cx="27" cy="27" r="2" />
    </svg>
  )
}
