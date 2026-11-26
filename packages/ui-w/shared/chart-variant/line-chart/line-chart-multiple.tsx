"use client"

import type * as React from "react"

import {
  LineChart,
  type ChartRow,
  type LineChartProps,
  type LineChartSeries,
} from "@packages/ui-w/shared/chart-variant/line-chart/line-chart"

export type LineChartMultipleSeries = LineChartSeries
export type LineChartMultipleProps<TData extends ChartRow> = Omit<
  LineChartProps<TData>,
  "curveType"
>

export function LineChartMultiple<TData extends ChartRow>(
  props: LineChartMultipleProps<TData>,
): React.ReactElement {
  return <LineChart {...props} />
}
