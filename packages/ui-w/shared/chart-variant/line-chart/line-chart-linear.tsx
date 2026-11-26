"use client"

import type * as React from "react"

import {
  LineChart,
  type ChartRow,
  type LineChartProps,
  type LineChartSeries,
} from "@packages/ui-w/shared/chart-variant/line-chart/line-chart"

export type LineChartLinearSeries = LineChartSeries
export type LineChartLinearProps<TData extends ChartRow> = Omit<LineChartProps<TData>, "curveType">

export function LineChartLinear<TData extends ChartRow>(
  props: LineChartLinearProps<TData>,
): React.ReactElement {
  return <LineChart {...props} curveType="linear" />
}
