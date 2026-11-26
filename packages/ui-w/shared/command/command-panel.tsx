"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function CommandPanel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "bg-popover relative -mx-px min-h-0 rounded-xl border border-b-0 bg-clip-padding [clip-path:inset(0_1px)] not-has-[+[data-slot=command-footer]]:-mb-px not-has-[+[data-slot=command-footer]]:rounded-xl not-has-[+[data-slot=command-footer]]:[clip-path:inset(0_1px_1px_1px_round_.5rem)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl **:data-[slot=scroll-area-scrollbar]:mt-2",
      className,
    ),
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
