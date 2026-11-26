"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconX } from "@tabler/icons-react"

export function MapPopupCloseButton({
  render,
  ...props
}: useRender.ComponentProps<"button">): React.ReactElement {
  const defaultProps = {
    "aria-label": "Close popup",
    children: <IconX className="size-3.5" />,
    className:
      "focus-visible:ring-ring hover:bg-muted text-foreground absolute top-0.5 right-0.5 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2",
    type: "button" as const,
  }

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  })
}
