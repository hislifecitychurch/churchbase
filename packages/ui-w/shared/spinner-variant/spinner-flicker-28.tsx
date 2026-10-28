import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export function SpinnerFlicker28({
  className,
  ...props
}: React.ComponentProps<"svg">): React.ReactElement {
  return (
    <svg
      aria-label="Loading"
      className={cn("spinner-flicker size-4", className)}
      role="status"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="3" cy="3" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__100011"
        cx="9"
        cy="3"
        r="2"
        opacity={1}
      />
      <circle cx="15" cy="3" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__100001"
        cx="15"
        cy="3"
        r="2"
        opacity={1}
      />
      <circle cx="21" cy="3" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__110001"
        cx="21"
        cy="3"
        r="2"
        opacity={1}
      />
      <circle cx="27" cy="3" r="2" />
      <circle cx="3" cy="9" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__000011"
        cx="3"
        cy="9"
        r="2"
        opacity={0}
      />
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="9" r="2" />
      <circle cx="21" cy="9" r="2" />
      <circle cx="27" cy="9" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__110000"
        cx="27"
        cy="9"
        r="2"
        opacity={1}
      />
      <circle cx="3" cy="15" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__000111"
        cx="3"
        cy="15"
        r="2"
        opacity={0}
      />
      <circle cx="9" cy="15" r="2" />
      <circle cx="15" cy="15" r="2" />
      <circle cx="21" cy="15" r="2" />
      <circle cx="27" cy="15" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__111000"
        cx="27"
        cy="15"
        r="2"
        opacity={1}
      />
      <circle cx="3" cy="21" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__000110"
        cx="3"
        cy="21"
        r="2"
        opacity={0}
      />
      <circle cx="9" cy="21" r="2" />
      <circle cx="15" cy="21" r="2" />
      <circle cx="21" cy="21" r="2" />
      <circle cx="27" cy="21" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__011000"
        cx="27"
        cy="21"
        r="2"
        opacity={0}
      />
      <circle cx="3" cy="27" r="2" />
      <circle cx="9" cy="27" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__001110"
        cx="9"
        cy="27"
        r="2"
        opacity={0}
      />
      <circle cx="15" cy="27" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__001100"
        cx="15"
        cy="27"
        r="2"
        opacity={0}
      />
      <circle cx="21" cy="27" r="2" />
      <circle
        className="spinner-flicker__on spinner-flicker__011100"
        cx="21"
        cy="27"
        r="2"
        opacity={0}
      />
      <circle cx="27" cy="27" r="2" />
    </svg>
  )
}
