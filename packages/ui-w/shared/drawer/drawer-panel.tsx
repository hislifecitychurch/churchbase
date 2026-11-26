"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

import { ScrollArea } from "@packages/ui-w/shared/scroll-area/scroll-area"
import { DrawerContent } from "@packages/ui-w/shared/drawer/drawer-content"

export function DrawerPanel({
  className,
  scrollFade = true,
  scrollable = true,
  allowSelection = true,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  scrollFade?: boolean
  scrollable?: boolean
  allowSelection?: boolean
}): React.ReactElement {
  const defaultProps = {
    className: cn(
      "p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1",
      !allowSelection && "cursor-default",
      className,
    ),
    "data-slot": "drawer-panel",
  }

  const content = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render: allowSelection ? <DrawerContent render={render} /> : render,
  })

  if (scrollable) {
    return (
      <ScrollArea className="touch-auto" scrollFade={scrollFade}>
        {content}
      </ScrollArea>
    )
  }

  return content
}
