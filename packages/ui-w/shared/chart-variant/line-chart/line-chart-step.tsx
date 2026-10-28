"use client"

import type * as React from "react"

import {
  LineChart,
  type ChartRow,
  type LineChartProps,
  type LineChartSeries,
} from "@packages/ui-w/shared/chart-variant/line-chart/line-chart"

export type LineChartStepSeries = LineChartSeries
export type LineChartStepProps<TData extends ChartRow> = Omit<LineChartProps<TData>, "curveType">

export function LineChartStep<TData extends ChartRow>(
  props: LineChartStepProps<TData>,
): React.ReactElement {
  return <LineChart {...props} curveType="stepAfter" />
}
