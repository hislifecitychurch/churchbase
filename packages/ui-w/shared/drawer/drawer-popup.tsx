"use client"

import { useContext } from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { IconX } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Button } from "@packages/ui-w/shared/button/button"
import { DrawerBackdrop } from "@packages/ui-w/shared/drawer/drawer-backdrop"
import { DrawerBar } from "@packages/ui-w/shared/drawer/drawer-bar"
import { DrawerContext, type DrawerPosition } from "@packages/ui-w/contexts/drawer-context"
import { DrawerPortal } from "@packages/ui-w/shared/drawer/drawer-portal"
import { DrawerViewport } from "@packages/ui-w/shared/drawer/drawer-viewport"

export function DrawerPopup({
  className,
  children,
  showCloseButton = false,
  position: positionProp,
  variant = "default",
  showBar = false,
  portalProps,
  ...props
}: DrawerPrimitive.Popup.Props & {
  showCloseButton?: boolean
  position?: DrawerPosition
  variant?: "default" | "straight" | "inset"
  showBar?: boolean
  portalProps?: DrawerPrimitive.Portal.Props
}): React.ReactElement {
  const { position: contextPosition } = useContext(DrawerContext)
  const position = positionProp ?? contextPosition

  return (
    <DrawerPortal {...portalProps}>
      <DrawerBackdrop />
      <DrawerViewport position={position} variant={variant}>
        <DrawerPrimitive.Popup
          className={cn(
            "bg-popover text-popover-foreground after:bg-popover relative flex max-h-full min-h-0 w-full min-w-0 flex-col shadow-lg/5 transition-[transform,box-shadow,height,background-color] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform outline-none [--peek:calc(--spacing(6)-1px)] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute data-ending-style:shadow-transparent data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-open:overflow-hidden data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(2%*(var(--nested-drawers)-var(--stack-progress))))] data-starting-style:shadow-transparent data-swiping:select-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)] dark:data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*(var(--nested-drawers)-var(--stack-progress))))]",
            "touch-none",
            position === "bottom" &&
              "row-start-2 -mb-[max(0px,calc(var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] transform-[translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] border-t pb-[max(0px,calc(env(safe-area-inset-bottom,0px)+var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] not-data-starting-style:not-data-ending-style:transition-[transform,box-shadow,height,background-color,margin,padding] after:inset-x-0 after:top-full after:h-(--bleed) has-data-[slot=drawer-bar]:pt-2 data-ending-style:mb-0 data-ending-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] data-ending-style:pb-0 data-starting-style:mb-0 data-starting-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] data-starting-style:pb-0",
            position === "top" &&
              "transform-[translateY(var(--drawer-swipe-movement-y))] border-b after:inset-x-0 after:bottom-full after:h-(--bleed) has-data-[slot=drawer-bar]:pb-2 data-ending-style:transform-[translateY(calc(-100%-var(--inset)))] data-starting-style:transform-[translateY(calc(-100%-var(--inset)))]",
            position === "left" &&
              "w-[calc(100%-(--spacing(12)))] max-w-md transform-[translateX(var(--drawer-swipe-movement-x))] border-e after:inset-y-0 after:end-full after:w-(--bleed) has-data-[slot=drawer-bar]:pe-2 data-ending-style:transform-[translateX(calc(-100%-var(--inset)))] data-starting-style:transform-[translateX(calc(-100%-var(--inset)))]",
            position === "right" &&
              "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md transform-[translateX(var(--drawer-swipe-movement-x))] border-s after:inset-y-0 after:start-full after:w-(--bleed) has-data-[slot=drawer-bar]:ps-2 data-ending-style:transform-[translateX(calc(100%+var(--inset)))] data-starting-style:transform-[translateX(calc(100%+var(--inset)))]",
            variant !== "straight" &&
              cn(
                position === "bottom" && "rounded-t-xl",
                position === "top" &&
                  "rounded-b-xl **:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-xl)-1px)]",
                position === "left" &&
                  "rounded-e-xl **:data-[slot=drawer-footer]:rounded-ee-[calc(var(--radius-xl)-1px)]",
                position === "right" &&
                  "rounded-s-xl **:data-[slot=drawer-footer]:rounded-es-[calc(var(--radius-xl)-1px)]",
              ),
            variant === "default" &&
              cn(
                position === "bottom" && "before:rounded-t-[calc(var(--radius-xl)-1px)]",
                position === "top" && "before:rounded-b-[calc(var(--radius-xl)-1px)]",
                position === "left" && "before:rounded-e-[calc(var(--radius-xl)-1px)]",
                position === "right" && "before:rounded-s-[calc(var(--radius-xl)-1px)]",
              ),
            variant === "inset" &&
              "before:hidden sm:rounded-xl sm:border sm:before:rounded-[calc(var(--radius-xl)-1px)] sm:after:bg-transparent sm:**:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-xl)-1px)]",
            variant === "straight" && "[--stack-step:0]",
            (position === "bottom" || position === "top") &&
              "h-(--drawer-height,auto) [--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))))] data-nested-drawer-open:h-(--height)",
            position === "bottom" &&
              "origin-[50%_calc(100%-var(--inset))] data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))]",
            position === "top" &&
              "origin-[50%_var(--inset)] data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--shrink)*var(--height))))_scale(var(--scale))]",
            position === "left" &&
              "origin-right data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)))_scale(var(--scale))]",
            position === "right" &&
              "origin-left data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)))_scale(var(--scale))]",
            className,
          )}
          data-slot="drawer-popup"
          {...props}
        >
          {children}
          {showCloseButton && (
            <DrawerPrimitive.Close
              aria-label="Close"
              className="absolute end-2 top-2"
              render={<Button size="icon" variant="ghost" />}
            >
              <IconX />
            </DrawerPrimitive.Close>
          )}
          {showBar && <DrawerBar />}
        </DrawerPrimitive.Popup>
      </DrawerViewport>
    </DrawerPortal>
  )
}
