"use client"

import * as React from "react"

import { ChartContext, type ChartContextProps } from "@packages/ui-w/contexts/chart-context"

export function useChart(): ChartContextProps {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}
