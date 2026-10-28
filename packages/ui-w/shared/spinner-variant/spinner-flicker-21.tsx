import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export function SpinnerFlicker21({
  className,
  style,
  ...props
}: React.ComponentProps<"svg">): React.ReactElement {
  return (
    <svg
      aria-label="Loading"
      className={cn("spinner-flicker-21 size-4", className)}
      role="status"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={
        {
          "--on": "var(--spinner-flicker-foreground)",
          "--off": "var(--spinner-flicker-background)",
          "--dur": "2.400s",
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
    @keyframes fs0000111000001110 { 0% { opacity: 0; } 24.99% { opacity: 0; } 25.00% { opacity: 1; } 43.74% { opacity: 1; } 43.75% { opacity: 0; } 74.99% { opacity: 0; } 75.00% { opacity: 1; } 93.74% { opacity: 1; } 93.75% { opacity: 0; } 100% { opacity: 0; } }
    @keyframes fs0000001000000010 { 0% { opacity: 0; } 37.49% { opacity: 0; } 37.50% { opacity: 1; } 43.74% { opacity: 1; } 43.75% { opacity: 0; } 87.49% { opacity: 0; } 87.50% { opacity: 1; } 93.74% { opacity: 1; } 93.75% { opacity: 0; } 100% { opacity: 0; } }
    @keyframes fs0000001100000011 { 0% { opacity: 0; } 37.49% { opacity: 0; } 37.50% { opacity: 1; } 49.99% { opacity: 1; } 50.00% { opacity: 0; } 87.49% { opacity: 0; } 87.50% { opacity: 1; } 100% { opacity: 1; } }
    @keyframes fs0000010100000101 { 0% { opacity: 0; } 31.24% { opacity: 0; } 31.25% { opacity: 1; } 37.49% { opacity: 1; } 37.50% { opacity: 0; } 43.74% { opacity: 0; } 43.75% { opacity: 1; } 49.99% { opacity: 1; } 50.00% { opacity: 0; } 81.24% { opacity: 0; } 81.25% { opacity: 1; } 87.49% { opacity: 1; } 87.50% { opacity: 0; } 93.74% { opacity: 0; } 93.75% { opacity: 1; } 100% { opacity: 1; } }
    @keyframes fs1100011110000111 { 0% { opacity: 1; } 12.49% { opacity: 1; } 12.50% { opacity: 0; } 31.24% { opacity: 0; } 31.25% { opacity: 1; } 56.24% { opacity: 1; } 56.25% { opacity: 0; } 81.24% { opacity: 0; } 81.25% { opacity: 1; } 100% { opacity: 1; } }
    @keyframes fs1000100010001000 { 0% { opacity: 1; } 6.24% { opacity: 1; } 6.25% { opacity: 0; } 24.99% { opacity: 0; } 25.00% { opacity: 1; } 31.24% { opacity: 1; } 31.25% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 56.24% { opacity: 1; } 56.25% { opacity: 0; } 74.99% { opacity: 0; } 75.00% { opacity: 1; } 81.24% { opacity: 1; } 81.25% { opacity: 0; } 100% { opacity: 0; } }
    @keyframes fs1111000111110001 { 0% { opacity: 1; } 24.99% { opacity: 1; } 25.00% { opacity: 0; } 43.74% { opacity: 0; } 43.75% { opacity: 1; } 74.99% { opacity: 1; } 75.00% { opacity: 0; } 93.74% { opacity: 0; } 93.75% { opacity: 1; } 100% { opacity: 1; } }
    @keyframes fs0101000001010000 { 0% { opacity: 0; } 6.24% { opacity: 0; } 6.25% { opacity: 1; } 12.49% { opacity: 1; } 12.50% { opacity: 0; } 18.74% { opacity: 0; } 18.75% { opacity: 1; } 24.99% { opacity: 1; } 25.00% { opacity: 0; } 56.24% { opacity: 0; } 56.25% { opacity: 1; } 62.49% { opacity: 1; } 62.50% { opacity: 0; } 68.74% { opacity: 0; } 68.75% { opacity: 1; } 74.99% { opacity: 1; } 75.00% { opacity: 0; } 100% { opacity: 0; } }
    @keyframes fs1111110011111100 { 0% { opacity: 1; } 37.49% { opacity: 1; } 37.50% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 87.49% { opacity: 1; } 87.50% { opacity: 0; } 100% { opacity: 0; } }
    @keyframes fs0010000000100000 { 0% { opacity: 0; } 12.49% { opacity: 0; } 12.50% { opacity: 1; } 18.74% { opacity: 1; } 18.75% { opacity: 0; } 62.49% { opacity: 0; } 62.50% { opacity: 1; } 68.74% { opacity: 1; } 68.75% { opacity: 0; } 100% { opacity: 0; } }
    @keyframes fs0011100001111000 { 0% { opacity: 0; } 12.49% { opacity: 0; } 12.50% { opacity: 1; } 31.24% { opacity: 1; } 31.25% { opacity: 0; } 56.24% { opacity: 0; } 56.25% { opacity: 1; } 81.24% { opacity: 1; } 81.25% { opacity: 0; } 100% { opacity: 0; } }
  `}</style>
      <circle cx="3" cy="3" r="2" />
      <circle
        className="on"
        cx="3"
        cy="3"
        r="2"
        opacity="0"
        style={{ animation: "fs0000111000001110 var(--dur) linear infinite" }}
      />
      <circle cx="9" cy="3" r="2" />
      <circle cx="15" cy="3" r="2" />
      <circle cx="21" cy="3" r="2" />
      <circle
        className="on"
        cx="21"
        cy="3"
        r="2"
        opacity="0"
        style={{ animation: "fs0000001000000010 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="3" r="2" />
      <circle
        className="on"
        cx="27"
        cy="3"
        r="2"
        opacity="0"
        style={{ animation: "fs0000001100000011 var(--dur) linear infinite" }}
      />
      <circle cx="3" cy="9" r="2" />
      <circle className="on" cx="3" cy="9" r="2" />
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="9" r="2" />
      <circle
        className="on"
        cx="15"
        cy="9"
        r="2"
        opacity="0"
        style={{ animation: "fs0000010100000101 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="9" r="2" />
      <circle cx="27" cy="9" r="2" />
      <circle
        className="on"
        cx="27"
        cy="9"
        r="2"
        opacity="1"
        style={{ animation: "fs1100011110000111 var(--dur) linear infinite" }}
      />
      <circle cx="3" cy="15" r="2" />
      <circle className="on" cx="3" cy="15" r="2" />
      <circle cx="9" cy="15" r="2" />
      <circle
        className="on"
        cx="9"
        cy="15"
        r="2"
        opacity="1"
        style={{ animation: "fs1000100010001000 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="15" r="2" />
      <circle cx="21" cy="15" r="2" />
      <circle cx="27" cy="15" r="2" />
      <circle className="on" cx="27" cy="15" r="2" />
      <circle cx="3" cy="21" r="2" />
      <circle
        className="on"
        cx="3"
        cy="21"
        r="2"
        opacity="1"
        style={{ animation: "fs1111000111110001 var(--dur) linear infinite" }}
      />
      <circle cx="9" cy="21" r="2" />
      <circle cx="15" cy="21" r="2" />
      <circle
        className="on"
        cx="15"
        cy="21"
        r="2"
        opacity="0"
        style={{ animation: "fs0101000001010000 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="21" r="2" />
      <circle cx="27" cy="21" r="2" />
      <circle
        className="on"
        cx="27"
        cy="21"
        r="2"
        opacity="1"
        style={{ animation: "fs1111110011111100 var(--dur) linear infinite" }}
      />
      <circle cx="3" cy="27" r="2" />
      <circle cx="9" cy="27" r="2" />
      <circle cx="15" cy="27" r="2" />
      <circle cx="21" cy="27" r="2" />
      <circle
        className="on"
        cx="21"
        cy="27"
        r="2"
        opacity="0"
        style={{ animation: "fs0010000000100000 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="27" r="2" />
      <circle
        className="on"
        cx="27"
        cy="27"
        r="2"
        opacity="0"
        style={{ animation: "fs0011100001111000 var(--dur) linear infinite" }}
      />
    </svg>
  )
}
