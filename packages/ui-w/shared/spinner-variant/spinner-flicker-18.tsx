import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export function SpinnerFlicker18({
  className,
  style,
  ...props
}: React.ComponentProps<"svg">): React.ReactElement {
  return (
    <svg
      aria-label="Loading"
      className={cn("spinner-flicker-18 size-4", className)}
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
        @keyframes fs1111100 { 0% { opacity: 1; } 71.42% { opacity: 1; } 71.43% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs1111101 { 0% { opacity: 1; } 71.42% { opacity: 1; } 71.43% { opacity: 0; } 85.70% { opacity: 0; } 85.71% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs1111001 { 0% { opacity: 1; } 57.13% { opacity: 1; } 57.14% { opacity: 0; } 85.70% { opacity: 0; } 85.71% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs0000110 { 0% { opacity: 0; } 57.13% { opacity: 0; } 57.14% { opacity: 1; } 85.70% { opacity: 1; } 85.71% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs1111010 { 0% { opacity: 1; } 57.13% { opacity: 1; } 57.14% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 85.70% { opacity: 1; } 85.71% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes fs1100101 { 0% { opacity: 1; } 28.56% { opacity: 1; } 28.57% { opacity: 0; } 57.13% { opacity: 0; } 57.14% { opacity: 1; } 71.42% { opacity: 1; } 71.43% { opacity: 0; } 85.70% { opacity: 0; } 85.71% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs1111011 { 0% { opacity: 1; } 57.13% { opacity: 1; } 57.14% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs0000011 { 0% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs0000111 { 0% { opacity: 0; } 57.13% { opacity: 0; } 57.14% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs0000101 { 0% { opacity: 0; } 57.13% { opacity: 0; } 57.14% { opacity: 1; } 71.42% { opacity: 1; } 71.43% { opacity: 0; } 85.70% { opacity: 0; } 85.71% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs0001101 { 0% { opacity: 0; } 42.85% { opacity: 0; } 42.86% { opacity: 1; } 71.42% { opacity: 1; } 71.43% { opacity: 0; } 85.70% { opacity: 0; } 85.71% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes fs1111110 { 0% { opacity: 1; } 85.70% { opacity: 1; } 85.71% { opacity: 0; } 100% { opacity: 0; } }
      `}</style>
      <circle cx="3" cy="3" r="2" />
      <circle cx="9" cy="3" r="2" />
      <circle
        className="on"
        cx="9"
        cy="3"
        r="2"
        opacity={1}
        style={{ animation: "fs1111100 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="3" r="2" />
      <circle
        className="on"
        cx="15"
        cy="3"
        r="2"
        opacity={1}
        style={{ animation: "fs1111101 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="3" r="2" />
      <circle
        className="on"
        cx="21"
        cy="3"
        r="2"
        opacity={1}
        style={{ animation: "fs1111001 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="3" r="2" />
      <circle cx="3" cy="9" r="2" />
      <circle
        className="on"
        cx="3"
        cy="9"
        r="2"
        opacity={0}
        style={{ animation: "fs0000110 var(--dur) linear infinite" }}
      />
      <circle cx="9" cy="9" r="2" />
      <circle
        className="on"
        cx="9"
        cy="9"
        r="2"
        opacity={1}
        style={{ animation: "fs1111010 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="9" r="2" />
      <circle
        className="on"
        cx="15"
        cy="9"
        r="2"
        opacity={1}
        style={{ animation: "fs1100101 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="9" r="2" />
      <circle
        className="on"
        cx="21"
        cy="9"
        r="2"
        opacity={1}
        style={{ animation: "fs1111011 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="9" r="2" />
      <circle
        className="on"
        cx="27"
        cy="9"
        r="2"
        opacity={0}
        style={{ animation: "fs0000011 var(--dur) linear infinite" }}
      />
      <circle cx="3" cy="15" r="2" />
      <circle
        className="on"
        cx="3"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs0000111 var(--dur) linear infinite" }}
      />
      <circle cx="9" cy="15" r="2" />
      <circle
        className="on"
        cx="9"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs0000101 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="15" r="2" />
      <circle className="on" cx="15" cy="15" r="2" />
      <circle cx="21" cy="15" r="2" />
      <circle
        className="on"
        cx="21"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs0000111 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="15" r="2" />
      <circle
        className="on"
        cx="27"
        cy="15"
        r="2"
        opacity={0}
        style={{ animation: "fs0000111 var(--dur) linear infinite" }}
      />
      <circle cx="3" cy="21" r="2" />
      <circle
        className="on"
        cx="3"
        cy="21"
        r="2"
        opacity={0}
        style={{ animation: "fs0000011 var(--dur) linear infinite" }}
      />
      <circle cx="9" cy="21" r="2" />
      <circle
        className="on"
        cx="9"
        cy="21"
        r="2"
        opacity={1}
        style={{ animation: "fs1111010 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="21" r="2" />
      <circle
        className="on"
        cx="15"
        cy="21"
        r="2"
        opacity={0}
        style={{ animation: "fs0001101 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="21" r="2" />
      <circle
        className="on"
        cx="21"
        cy="21"
        r="2"
        opacity={1}
        style={{ animation: "fs1111110 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="21" r="2" />
      <circle
        className="on"
        cx="27"
        cy="21"
        r="2"
        opacity={0}
        style={{ animation: "fs0000110 var(--dur) linear infinite" }}
      />
      <circle cx="3" cy="27" r="2" />
      <circle cx="9" cy="27" r="2" />
      <circle
        className="on"
        cx="9"
        cy="27"
        r="2"
        opacity={1}
        style={{ animation: "fs1111001 var(--dur) linear infinite" }}
      />
      <circle cx="15" cy="27" r="2" />
      <circle
        className="on"
        cx="15"
        cy="27"
        r="2"
        opacity={1}
        style={{ animation: "fs1111101 var(--dur) linear infinite" }}
      />
      <circle cx="21" cy="27" r="2" />
      <circle
        className="on"
        cx="21"
        cy="27"
        r="2"
        opacity={1}
        style={{ animation: "fs1111100 var(--dur) linear infinite" }}
      />
      <circle cx="27" cy="27" r="2" />
    </svg>
  )
}
