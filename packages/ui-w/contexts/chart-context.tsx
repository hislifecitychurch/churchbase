"use client"

import * as React from "react"

import type { ChartConfig } from "@repo/ui-w/shared/chart/chart"

export type ChartContextProps = {
  config: ChartConfig
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)
