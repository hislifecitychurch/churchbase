"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { cn } from "@packages/ui-w/lib/utils"

export function DrawerMenuRadioItem({
  className,
  children,
  value,
  disabled,
  render,
  ...props
}: RadioPrimitive.Root.Props & {
  value: string
  render?: React.ReactElement
}): React.ReactElement {
  return (
    <RadioPrimitive.Root
      className={cn(
        "text-foreground hover:bg-accent hover:text-accent-foreground grid min-h-9 w-full cursor-default items-center gap-2 rounded-xl px-2 py-1 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
        "grid-cols-[1rem_1fr] items-center pe-4",
        className,
      )}
      data-slot="drawer-menu-radio-item"
      disabled={disabled}
      render={render}
      value={value}
      {...props}
    >
      <RadioPrimitive.Indicator className="col-start-1">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
        </svg>
      </RadioPrimitive.Indicator>
      <span className="col-start-2">{children}</span>
    </RadioPrimitive.Root>
  )
}
