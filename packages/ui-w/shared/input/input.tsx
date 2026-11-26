"use client"

import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"
import { cn } from "@packages/ui-w/lib/utils"

export type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "lg" | number
  unstyled?: boolean
  nativeInput?: boolean
}

export function Input({
  className,
  size = "default",
  unstyled = false,
  nativeInput = false,
  style,
  ...props
}: InputProps): React.ReactElement {
  const interactionCursor = props.disabled
    ? "cursor-not-allowed [&_input]:cursor-not-allowed"
    : props.readOnly
      ? "cursor-default [&_input]:cursor-default"
      : undefined
  const inputClassName = cn(
    interactionCursor,
    "h-8.5 w-full min-w-0 rounded-xl px-[calc(--spacing(3)-1px)] leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5",
    size === "sm" && "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5",
    size === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
    props.type === "search" &&
      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    props.type === "file" &&
      "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
  )

  return (
    <span
      className={
        cn(
          interactionCursor,
          !unstyled &&
            "bg-muted text-foreground has-focus-visible:bg-input border-input has-focus-visible:border-ring relative inline-flex w-full overflow-hidden rounded-xl border text-base not-dark:bg-clip-padding has-disabled:opacity-64 has-aria-invalid:border-red-700 has-focus-visible:has-aria-invalid:border-red-700 has-focus-visible:has-aria-invalid:ring-[3px] has-focus-visible:has-aria-invalid:ring-red-700/20 sm:text-sm dark:has-aria-invalid:border-red-400 dark:has-focus-visible:has-aria-invalid:border-red-400 dark:has-focus-visible:has-aria-invalid:ring-red-400/24",
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={typeof style === "function" ? undefined : style}
          {...props}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={style}
          {...props}
        />
      )}
    </span>
  )
}
