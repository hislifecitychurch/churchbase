"use client"

import type * as React from "react"

import {
  LineChart,
  type ChartRow,
  type LineChartProps,
  type LineChartReferenceLine,
  type LineChartSeries,
} from "@packages/ui-w/shared/chart-variant/line-chart/line-chart"

export type LineChartMultipleStepSeries = LineChartSeries
export type LineChartMultipleStepReferenceLine = LineChartReferenceLine
export type LineChartMultipleStepProps<TData extends ChartRow> = Omit<
  LineChartProps<TData>,
  "curveType"
>

export function LineChartMultipleStep<TData extends ChartRow>(
  props: LineChartMultipleStepProps<TData>,
): React.ReactElement {
  return <LineChart {...props} curveType="stepAfter" />
}
