"use client"

import * as React from "react"
import { format, isValid, parse } from "date-fns"
import { IconCalendar } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Button } from "@packages/ui-w/shared/button/button"
import { Calendar } from "@packages/ui-w/shared/calendar/calendar"
import { Input } from "@packages/ui-w/shared/input/input"
import { Popover } from "@packages/ui-w/shared/popover/popover"
import { PopoverPopup } from "@packages/ui-w/shared/popover/popover-popup"
import { PopoverTrigger } from "@packages/ui-w/shared/popover/popover-trigger"

export interface DatePickerWithInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange"
> {
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date | undefined) => void
  formatPattern?: string
  month?: Date
  onMonthChange?: (month: Date) => void
  placeholder?: string
  disabled?: boolean
  buttonAriaLabel?: string
  popupClassName?: string
  calendarClassName?: string
  inputWrapperClassName?: string
  popupAlign?: React.ComponentProps<typeof PopoverPopup>["align"]
  popupAlignOffset?: React.ComponentProps<typeof PopoverPopup>["alignOffset"]
  popupSide?: React.ComponentProps<typeof PopoverPopup>["side"]
  popupSideOffset?: React.ComponentProps<typeof PopoverPopup>["sideOffset"]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DatePickerWithInput(props: DatePickerWithInputProps): React.ReactElement {
  const {
    value,
    defaultValue,
    onChange,
    formatPattern = "yyyy-MM-dd",
    month: monthProp,
    onMonthChange,
    placeholder = "YYYY-MM-DD",
    disabled = false,
    buttonAriaLabel = "Select date",
    popupClassName,
    calendarClassName,
    inputWrapperClassName,
    popupAlign = "start",
    popupAlignOffset = -4,
    popupSide = "bottom",
    popupSideOffset = 8,
    className,
    open: openProp,
    onOpenChange,
    id,
    nativeInput = true,
    type,
    ...inputProps
  } = props

  const isControlled = Object.prototype.hasOwnProperty.call(props, "value")
  const isOpenControlled = Object.prototype.hasOwnProperty.call(props, "open")
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue)
  const [inputValue, setInputValue] = React.useState<string>(
    defaultValue ? format(defaultValue, formatPattern) : "",
  )
  const [internalMonth, setInternalMonth] = React.useState<Date>(defaultValue ?? new Date())
  const [internalOpen, setInternalOpen] = React.useState(false)

  const selectedDate = isControlled ? value : internalValue
  const month = monthProp ?? internalMonth
  const open = isOpenControlled ? openProp : internalOpen

  const commitValue = React.useCallback(
    (nextValue: Date | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isOpenControlled, onOpenChange],
  )

  const handleMonthChange = React.useCallback(
    (nextMonth: Date) => {
      if (monthProp === undefined) {
        setInternalMonth(nextMonth)
      }
      onMonthChange?.(nextMonth)
    },
    [monthProp, onMonthChange],
  )

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextInputValue = event.target.value
      setInputValue(nextInputValue)

      if (nextInputValue) {
        const parsedDate = parse(nextInputValue, formatPattern, new Date())

        if (isValid(parsedDate)) {
          commitValue(parsedDate)
          handleMonthChange(parsedDate)
        }
      } else {
        commitValue(undefined)
      }
    },
    [commitValue, formatPattern, handleMonthChange],
  )

  const handleSelect = React.useCallback(
    (nextDate: Date | undefined) => {
      commitValue(nextDate)

      if (nextDate) {
        setInputValue(format(nextDate, formatPattern))
        handleMonthChange(nextDate)
      } else {
        setInputValue("")
      }
    },
    [commitValue, formatPattern, handleMonthChange],
  )

  React.useEffect(() => {
    if (selectedDate) {
      setInputValue(format(selectedDate, formatPattern))
    } else {
      setInputValue("")
    }
  }, [formatPattern, selectedDate])

  React.useEffect(() => {
    if (monthProp !== undefined) {
      return
    }

    if (selectedDate) {
      setInternalMonth(selectedDate)
    }
  }, [monthProp, selectedDate])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "border-input bg-background text-foreground ring-ring/24 has-focus-within:border-ring relative inline-flex w-full rounded-xl border has-focus-within:ring-[3px] has-disabled:opacity-64",
          inputWrapperClassName,
        )}
      >
        <Input
          {...inputProps}
          id={id}
          value={inputValue}
          type={type ?? "date"}
          nativeInput={nativeInput}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleInputChange}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "rounded-xl border-0 bg-transparent shadow-none before:hidden focus-visible:ring-0 has-focus-visible:border-transparent has-aria-invalid:border-transparent dark:bg-transparent",
            "*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none",
            className,
          )}
        />
        <div className="border-input flex items-center border-s px-1">
          <PopoverTrigger
            aria-label={buttonAriaLabel}
            disabled={disabled}
            render={
              <Button
                aria-label={buttonAriaLabel}
                size="icon-sm"
                variant="ghost"
                className="size-8 rounded-xl"
              />
            }
          >
            <IconCalendar aria-hidden="true" className="size-4" />
          </PopoverTrigger>
        </div>
      </div>
      <PopoverPopup
        align={popupAlign}
        alignOffset={popupAlignOffset}
        side={popupSide}
        sideOffset={popupSideOffset}
        className={popupClassName}
      >
        <Calendar
          className={calendarClassName}
          mode="single"
          month={month}
          onMonthChange={handleMonthChange}
          onSelect={handleSelect}
          selected={selectedDate}
        />
      </PopoverPopup>
    </Popover>
  )
}
