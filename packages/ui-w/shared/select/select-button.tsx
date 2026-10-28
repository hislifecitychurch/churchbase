"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { type VariantProps } from "class-variance-authority"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"
import { selectTriggerVariants } from "@packages/ui-w/shared/variants"

export interface SelectButtonProps
  extends useRender.ComponentProps<"button">, VariantProps<typeof selectTriggerVariants> {}

export const selectTriggerIconClassName = "-me-1 size-4.5 opacity-80 sm:size-4"

export function SelectButton({
  className,
  size = "default",
  render,
  children,
  ...props
}: SelectButtonProps): React.ReactElement {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render
    ? undefined
    : (props.type ?? "button")
  const defaultProps = {
    children: (
      <>
        <span className="in-data-placeholder:text-muted-foreground/72 flex-1 truncate">
          {children}
        </span>
        <IconChevronDown className={selectTriggerIconClassName} />
      </>
    ),
    className: cn(selectTriggerVariants({ size }), "min-w-0 cursor-pointer", className),
    "data-slot": "select-button",
    type: typeValue,
  }
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  })
}
