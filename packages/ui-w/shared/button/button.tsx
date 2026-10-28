"use client"

import type * as React from "react"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender, type UseRenderComponentProps } from "@base-ui/react/use-render"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@repo/ui-w/lib/utils"
import { buttonVariants } from "@repo/ui-w/shared/variants"

import { SpinnerFlicker01 } from "@repo/ui-w/shared/spinner-variant/spinner-flicker-01"

export interface ButtonProps extends UseRenderComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  loading?: boolean
}

export function Button({
  className,
  variant,
  size,
  render,
  children,
  loading = false,
  disabled: disabledProp,
  ...props
}: ButtonProps): React.ReactElement {
  const isDisabled: boolean = Boolean(loading || disabledProp)
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render
    ? undefined
    : (props.type ?? "button")

  const defaultProps = {
    children: (
      <>
        <span
          className={cn("inline-flex items-center justify-center gap-2", loading && "opacity-0")}
        >
          {children}
        </span>
        {loading ? (
          <SpinnerFlicker01
            className="pointer-events-none absolute"
            data-slot="button-loading-indicator"
          />
        ) : null}
      </>
    ),
    className: cn(buttonVariants({ className, size, variant })),
    "aria-disabled": loading || undefined,
    "data-loading": loading ? "" : undefined,
    "data-slot": "button",
    disabled: isDisabled,
    type: typeValue,
  }

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  })
}
